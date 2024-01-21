
using Microsoft.Extensions.Configuration;

namespace Tests;

public static class TestHelper
{
    public static IConfigurationRoot GetIConfigurationRoot()
    {
        return new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddUserSecrets("e3dfcccf-0cb3-423a-b302-e3e92e95c128")
            .AddEnvironmentVariables()
            .Build();
    }
}
