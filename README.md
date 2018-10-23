# fdc
http://fdcamplify.s3-website-us-east-1.amazonaws.com

## Creating & configuring the Vue project

npm install -g @vue/cli

## Clone project and install dependencies 

### Getting Started

1. Clone project and install dependencies 

```
$ git clone https://github.com/FreelanceDeveloperCoach/fdc-web-ui.git
```

```
$ cd fdc-web-ui
```

```
$ npm install
```

2. Intialize a new [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli) project:

```
$ npm install -g @aws-amplify/cli
```

Configures the AWS access credentials, AWS Region and sets up a new AWS User Profile
```
$ amplify configure
```

Initializes a new project, sets up deployment resources in the cloud and prepares your project for Amplify.
```
$ amplify init
```

Add auth
```
$ amplify add auth
```
Change Cognito User Attributes to Email address or phone number
<img src="documentation/img/cognitouserattributes.png" width="480px" />

add this code in the amplify/backend/auth/cognitoxxxx/cognitoxxxx-cloudformation-template.yml
```
UsernameAttributes:
          - "email"
```

example
```
  UserPool:
  # Created upon user selection
  # Depends on SNS Role for Arn if MFA is enabled
    Type: AWS::Cognito::UserPool
    Properties:
      UserPoolName: !Ref userPoolName
      Schema: 
        
        -
          Name: email
          Required: true
          Mutable: true
        
      
      AutoVerifiedAttributes: !Ref autoVerifiedAttributes
      UsernameAttributes:
          - "email"
      
      EmailVerificationMessage: !Ref emailVerificationMessage
      EmailVerificationSubject: !Ref emailVerificationSubject
```

Provisions cloud resources with the latest local developments.
```
$ amplify push
```
### ! Be sure that you have own `.env` file

You can generate .env file manually by running:
```
cp .env.example .env
```

stripe test card info
https://stripe.com/docs/testing

generate stripe Publishable key
<img src="documentation/img/stripe.png" width="480px" />

create paypal app and credentials
https://developer.paypal.com/docs/integration/admin/manage-apps/#create-an-app-for-testing



### Compiles and hot-reloads for development
```
$ npm run serve
```

### Compiles and minifies for production
```
$ npm run build
```
### deploy to s3 bucket

```
$ sh deployment.sh prod
```

### Run your tests
```
$ npm run test
```
