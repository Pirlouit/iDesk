using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ConnectedDesk
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<MsGraph.MsGraphConfig>(Configuration.GetSection("MsGraphSettings"));
            services.AddSingleton<MsGraph.MsGraphClient>();

            services.AddCors();

            services.AddMvc();
            services.AddSingleton<Helpers.LEDHelper>();

#if DEBUG
           
#else
            // Enforce HTTPS
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new RequireHttpsAttribute());
            });
#endif
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors(builder =>
            {
                builder.WithOrigins("http://localhost");
                builder.AllowAnyOrigin();
                builder.AllowAnyHeader();
            });

            app.UseStaticFiles();

            app.UseWebSockets(new WebSocketOptions {
                KeepAliveInterval = TimeSpan.FromMilliseconds(3000),
                ReceiveBufferSize = 4 * 1024
            });

#if DEBUG
           
#else
            //Force HTTPS redirection
            app.UseRewriter(new RewriteOptions().AddRedirectToHttps());
#endif

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
