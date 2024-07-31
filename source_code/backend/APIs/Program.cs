using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Domain.Models;
using Domain;
using Infrastructure.Persistence;
using Infrastructure.Extensions;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Application.Interfaces;
using Application.Services;
using BCrypt.Net;
using Microsoft.Extensions.Logging;


var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddDebug();
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BlogDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("blog_db")));

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICategoriesService, CategoriesService>();
builder.Services.AddScoped<ICommentsService, CommentsService>();
builder.Services.AddScoped<IPostMediumsService, PostMediumsService>();
builder.Services.AddScoped<IPostCategoriesService, PostCategoriesService>();
builder.Services.AddScoped<IPostService, PostService>();
builder.Services.AddScoped<IRatingsService, RatingsService>();
builder.Services.AddScoped<ISearchService, SearchService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IViewsService, ViewsService>();
//extension func in app layer contains these services

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64; // Increase the maximum depth if needed
    });

builder.Services.AddInfrastructure();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFrontend",
        builder => builder.WithOrigins("http://localhost:3000")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials());
});


builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/api/account/login";
        options.LogoutPath = "/api/account/logout";
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
        options.SlidingExpiration = true;
    });

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
}

var logger = app.Logger;

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseCors("AllowReactFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();
app.UseStaticFiles();
app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<BlogDbContext>();
        context.Database.EnsureCreated();
    }
    catch (Exception ex)
    {

        Console.WriteLine($"An error occurred while initializing the database: {ex.Message}");
        throw;
    }
}

app.Run();
