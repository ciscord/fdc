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

Add analytics
```
$ amplify add analytics
```

Provisions cloud resources with the latest local developments.
```
$ amplify push
```

Amazon Pinpoint Analytics with Amazon Cognito User Pools
https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-pinpoint-integration.html


### ! Be sure that you have own `.env` file

You can generate .env file manually by running:
```
cp .env.example .env
```
generate stripe Publishable key
<img src="documentation/img/stripe.png" width="480px" />

copy Publishable key and replace VUE_APP_STRIPE_KEY value in the .env file

stripe test card info
https://stripe.com/docs/testing


generate paypal Client ID

1. login https://developer.paypal.com
2. click Dashboard/My Apps & Credentials
<img src="documentation/img/developerpaypal.png" width="480px" />
3. click Create App button
<img src="documentation/img/create_app.png" width="480px" />
4. Copy & paste sandbox/live Client ID
<img src="documentation/img/paypalclientid.png" width="480px" />

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
