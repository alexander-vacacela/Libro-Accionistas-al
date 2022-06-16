export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "libroaccionistasdbe6011c": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "libroaccionistas": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        },
        "apiQLDBprod": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "storage": {
        "imagestorage": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "function": {
        "crearRegistro": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    }
}