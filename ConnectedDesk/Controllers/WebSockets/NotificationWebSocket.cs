using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ConnectedDesk.Helpers;

namespace ConnectedDesk.Controllers.WebSockets {
    public class NotificationWebSocket : Controller {
        private static readonly List<WebSocket> AllSockets = new List<WebSocket>();
        public static NotificationWebSocket instance;
        private readonly LEDHelper _ledHelper;
        public NotificationWebSocket(LEDHelper LedHelper)
        {
            instance = this;
            _ledHelper = LedHelper;
        }

        // SOCKET: 
        [Route("ws/NotificationServer/")]
        public async Task NotificationServer() {
            if (HttpContext.WebSockets.IsWebSocketRequest) {
                var currentSocket = await HttpContext.WebSockets.AcceptWebSocketAsync(); //Start the websocket connection

                try {
                    await OnOpenAsync(currentSocket);

                    while (currentSocket.State == WebSocketState.Open) { //As long as the client doesn't disconnect
                        var buffer = new ArraySegment<byte>(new byte[4096]);
                        var received = await currentSocket.ReceiveAsync(buffer, HttpContext.RequestAborted);

                        if (received.MessageType == WebSocketMessageType.Text) { //Incomming message
                            var msg = Encoding.UTF8.GetString(buffer.Array, buffer.Offset, buffer.Count).Replace("\0", ""); //Remove useless chars from the buffer and split
                            await OnMessageAsync(msg, currentSocket);
                        } else if (received.MessageType == WebSocketMessageType.Close) { //The client disconnected
                            await OnCloseAsync(currentSocket);
                        }
                    }
                } catch (Exception e) {
                    await OnError(e, currentSocket);
                }
            }
        }

        //Handle Socket Events
        private async Task OnOpenAsync(WebSocket currentSocket) {
            AllSockets.Add(currentSocket);
            await SocketSendAsync(currentSocket, "{\"Key\":\"techOffice\",\"techOffice\": \"" + Startup.Configuration["TechOffice"] + "\"}");
            await SocketSendAsync(currentSocket, "{\"Key\":\"openWeatherMap\",\"openWeatherMap\": \"" + Startup.Configuration["OpenWeatherMap"] + "\"}");
        }
        private async Task OnMessageAsync(string msg, WebSocket currentSocket) {            
            await SocketBroadcast(msg);
        }
        private async Task OnCloseAsync(WebSocket currentSocket) {
            AllSockets.Remove(currentSocket); //Remove its connection from the list
            await currentSocket.CloseOutputAsync(WebSocketCloseStatus.EndpointUnavailable, "Client closed", CancellationToken.None);
        }
        private async Task OnError(Exception e, WebSocket currentSocket) {
            Debug.WriteLine(e.StackTrace);
            Debug.WriteLine("This exception was printed by PlayWebSocket.OnError");
            await OnDropAsync(currentSocket);
        }
        private async Task OnDropAsync(WebSocket currentSocket) {
            await OnCloseAsync(currentSocket);
        }

        //Private
        public  async Task SocketSendAsync(WebSocket socket, string message) {
            var msg = new ArraySegment<byte>(Encoding.ASCII.GetBytes(message));
            await socket.SendAsync(msg, WebSocketMessageType.Text, true, CancellationToken.None);
        }
        public async Task SocketBroadcast(string message) {
            if (!message.Contains("type") && !message.Contains("time"))
            {
                var notification = JsonConvert.DeserializeObject<Models.Notification>(message);
                if (notification != null)
                {
                    switch (notification.Priority)
                    {
                        case 0:
                            //Allume les leds en low (GREEN)
                            await _ledHelper.SendNotification("notimportant");
                            break;
                        case 2:
                            //Allume les leds en low (RED)
                            await _ledHelper.SendNotification("important");
                            break;
                        default:
                            break;
                    }

                }
            }

            var msg = new ArraySegment<byte>(Encoding.ASCII.GetBytes(message));

            foreach (var socket in AllSockets) {
                await socket.SendAsync(msg, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}