using ConnectedDesk.Models;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ConnectedDesk.MsGraph
{
    /*
     * This client allows you to easily accees any end point from Microsoft GRAPH API
     * 
     * For now it only allows you to access the Oulook calendar and emails
     * 
     */

    public class MsGraphClient
    {
        private readonly MsGraphConfig msGraphConfig;
        
        public MsGraphClient(IOptions<MsGraphConfig> msGraphConfig)
        {
            this.msGraphConfig = msGraphConfig.Value;
        }

        public async Task<T> CreateAndSendRequestAsync<T>(HttpMethod httpMethod, string query, object body = null)
        {
            ConfidentialClientApplication daemonClient = new ConfidentialClientApplication(msGraphConfig.ClientId, String.Format(msGraphConfig.AuthorityFormat, msGraphConfig.TenantId), msGraphConfig.RedirectUri, new ClientCredential(msGraphConfig.ClientSecret), null, new TokenCache());
            AuthenticationResult authResult = await daemonClient.AcquireTokenForClientAsync(new string[] { msGraphConfig.Scope });

            using (HttpClient client = new HttpClient())
            {
                HttpRequestMessage request = new HttpRequestMessage(httpMethod, String.Format(query, msGraphConfig.User));
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", authResult.AccessToken);

                if (body != null)
                    request.Content = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.SendAsync(request);
                string responseBody = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<T>(responseBody);
            }            
        }

        public async Task<List<OutlookEvent>> FindEventAsync(DateTime startTime, DateTime endTime)
        {
            string query = BuildQuery(msGraphConfig.QueryCalendarView, $"startdatetime={startTime}", $"enddatetime={endTime}");
            var root = await CreateAndSendRequestAsync<OutlookRoot<OutlookEvent>>(HttpMethod.Get, query);
            return root?.Value;
        }

        public async Task<List<OutlookEvent>> GetAllEventsAsync()
        {
            string query = BuildQuery(msGraphConfig.QueryCalendarView, $"startdatetime={DateTime.Now.ToUniversalTime()}", $"enddatetime={DateTime.Now.AddYears(10)}");
            var root = await CreateAndSendRequestAsync<OutlookRoot<OutlookEvent>>(HttpMethod.Get, query);
            return root?.Value;
        }

        public async Task<OutlookMail> GetLastEmailAsync()
        {
            string query = BuildQuery(msGraphConfig.QueryMessages, "$top=1");
            var root = await CreateAndSendRequestAsync<OutlookRoot<OutlookMail>>(HttpMethod.Get, query, null);
            return root?.Value?.FirstOrDefault();     
        }

        public async Task<List<OutlookMail>> GetAllEmailsAsync()
        {
            var root =  await CreateAndSendRequestAsync<OutlookRoot<OutlookMail>>(HttpMethod.Get, msGraphConfig.QueryMessages, null);
            return root?.Value;
        }

        private string BuildQuery(string url, params string[] queryStrings)
        {
            StringBuilder query = new StringBuilder(url);
            if (queryStrings.Length > 0)
            {
                query.Append("?");
                for (int i = 0; i < queryStrings.Length; i++)
                {
                    query.Append(queryStrings[i]);
                    if (i < queryStrings.Length - 1)
                        query.Append("&");
                }
            }            

            return query.ToString();
        }
    }
}
