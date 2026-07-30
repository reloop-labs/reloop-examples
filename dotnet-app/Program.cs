using Reloop;

var builder = WebApplication.CreateBuilder(args);

// Load .env file if present
if (File.Exists(".env"))
{
    foreach (var line in File.ReadAllLines(".env"))
    {
        var parts = line.Split('=', 2);
        if (parts.Length == 2)
        {
            Environment.SetEnvironmentVariable(parts[0].Trim(), parts[1].Trim());
        }
    }
}

var apiKey = Environment.GetEnvironmentVariable("RELOOP_API_KEY") ?? "rl_prod_S1P7dA_7zHsfSxaFNM3gv5tGchg";

// Register ReloopClient Singleton
builder.Services.AddSingleton(new ReloopClient(apiKey));
builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Urls.Add("http://localhost:8080");

Console.WriteLine("🚀 Alex's .NET Web Server running on http://localhost:8080");
app.Run();
