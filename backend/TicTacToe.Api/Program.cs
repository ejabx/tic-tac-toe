using TicTacToe.Api.Services;

namespace TicTacToe.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args); ;

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy => policy.WithOrigins("http://localhost:5173")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod());
            });
            builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

            builder.Services.AddSingleton<IBoardService, BoardService>();
            builder.Services.AddSingleton<IGameService, GameService>();

            var app = builder.Build();

            app.UseCors("AllowFrontend");
            app.UseSwagger();
            app.UseSwaggerUI();
            app.MapControllers();

            app.Run();
        }
    }
}