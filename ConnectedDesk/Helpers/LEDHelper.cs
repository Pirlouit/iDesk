using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices;

namespace ConnectedDesk.Helpers
{
    public class LEDHelper
    {
        private static string connectionString = "HostName=mic-iot-suite5215e.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=EWjyQKg6CclLaYMki8+NPnsnHYO4BjnAWUqycR+H654=";
        private static string LedStrip = "iDesk-LedStrip"; //Led strip ID in your IoT Hub
        private static RegistryManager registryManager = RegistryManager.CreateFromConnectionString(connectionString);
        private static ServiceClient serviceClient = ServiceClient.CreateFromConnectionString(connectionString);

        public LEDHelper()
        {

        }

        public async Task SendNotification(string notification)
        {
            Message commandMessage = null;
            try
            {
                commandMessage = new Message(Encoding.ASCII.GetBytes(notification));
            }
            catch (ArgumentNullException ex)
            {
                throw;
            }
            await serviceClient.SendAsync(LedStrip, commandMessage);
        }

    }
}
