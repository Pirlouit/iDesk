using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Devices;
using Microsoft.Azure.Devices.Common.Exceptions;

namespace ConnectedDesk.Helpers
{
    public class LEDHelper
    {
        private static string connectionString = Startup.Configuration["IotHub"];
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
                await serviceClient.SendAsync(LedStrip, commandMessage);
            }
            catch (ArgumentNullException ex)
            {
                throw;
            }
            catch (DeviceMaximumQueueDepthExceededException)
            {
            
            }
            
        }

    }
}
