async function startGooglePayCheckout() {
  try {
    // Init Sessions
    const paymentMethodsResponse = await callServer("/api/paymentMethods");

    // Create AdyenCheckout using Sessions response
    await createAdyenGooglePayCheckout(paymentMethodsResponse)

  } catch (error) {
    console.error(error);
    alert("Error occurred. Look at console for details");
  }
}

// Some payment methods use redirects. This is where we finalize the operation
async function finalizeGooglePayCheckout() {
    try {
        await createAdyenGooglePayCheckout({id: sessionId});
    } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
    }
}

async function createAdyenGooglePayCheckout(paymentMethodsResponse) {
    function handleOnChange(state, component) {
       const paymentsResponse = callServer("/api/payments", {state_data: state.data});
    }

    function handleOnAdditionalDetails(state, component) {
       
    }

    const configuration = {
       locale: "en_US", // The shopper's locale. For a list of supported locales, see https://docs.adyen.com/online-payments/web-components/localization-components.
       environment: "test", // When you're ready to accept live payments, change the value to one of our live environments https://docs.adyen.com/online-payments/components-web#testing-your-integration.  
       clientKey: clientKey, // Your client key. To find out how to generate one, see https://docs.adyen.com/development-resources/client-side-authentication. Web Components versions before 3.10.1 use originKey instead of clientKey.
       paymentMethodsResponse: paymentMethodsResponse, // The payment methods response returned in step 1.
       onChange: handleOnChange, // Your function for handling onChange event
       onAdditionalDetails: handleOnAdditionalDetails, // Your function for handling onAdditionalDetails environment
       // configuration: {
       //    merchantName: 'ATIDA',
       //    gatewayMerchantId: 'AtidaCompanyECOM_DEV',
       //    merchantId: 'BCR2DN4RTRCS37S3P'
       // }
    };

    const checkout = await AdyenCheckout(configuration);
    const googlePayConfiguration = {
        amount: {
            value: 1000,
            currency: "EUR"
        },
        countryCode: "NL",
        //Set this to PRODUCTION when you're ready to accept live payments
        environment: "TEST",
        // merchantName: 'ATIDA',
        // gatewayMerchantId: 'AtidaCompanyECOM_DEV',
        // merchantId: 'BCR2DN4RTRCS37S3P'
    };
    const googlePayComponent = checkout.create('paywithgoogle', googlePayConfiguration);
    googlePayComponent
       .isAvailable()
       .then(() => {
           googlePayComponent.mount("#googlepay-container");
       })
       .catch(e => {
           //Google Pay is not available
       });

    return new AdyenCheckout(configuration);
}

if (method == 'payments_api') {
    if (!sessionId) {
        startGooglePayCheckout();
    }
    else {
        // existing session: complete Checkout
        finalizeGooglePayCheckout();
    }
}
