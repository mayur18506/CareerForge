using CareerForge.API.Data;
using CareerForge.API.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.Configure<CareerForge.API.EmailSettings>(
    builder.Configuration.GetSection("EmailSettings"));

builder.Services.AddScoped<CareerForge.API.EmailService>();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT key is not configured.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine(
                    $"JWT ERROR: {context.Exception.Message}");

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddOpenApi(options =>
{

    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        var securitySchemes =
            new Dictionary<string, IOpenApiSecurityScheme>
            {
                ["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    In = ParameterLocation.Header,
                    BearerFormat = "JWT",
                    Description = "Enter your JWT token"
                }
            };


        document.Components ??= new OpenApiComponents();

        document.Components.SecuritySchemes = securitySchemes;

        document.Security = new List<OpenApiSecurityRequirement>
{
       new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer")] = new List<string>()
    }
};

        return Task.CompletedTask;
    });

    options.AddOperationTransformer((operation, context, cancellationToken) =>
    {
        var hasAuthorize = context.Description.ActionDescriptor.EndpointMetadata
            .OfType<Microsoft.AspNetCore.Authorization.AuthorizeAttribute>()
            .Any();

        if (hasAuthorize)
        {
            operation.Security ??= new List<OpenApiSecurityRequirement>();

            operation.Security.Add(
                new OpenApiSecurityRequirement
                {
                    [new OpenApiSecuritySchemeReference("Bearer")] =
    new List<string>()
                });
        }

        return Task.CompletedTask;
    });
});

builder.Services.AddScoped<ISkillService, SkillService>();

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<ILearningGoalService, LearningGoalService>();

builder.Services.AddScoped<IProjectService, ProjectService>();

builder.Services.AddScoped<IJobApplicationService, JobApplicationService>();

builder.Services.AddScoped<IDashboardService, DashboardService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("CareerForgeFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();


app.UseCors("CareerForgeFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
