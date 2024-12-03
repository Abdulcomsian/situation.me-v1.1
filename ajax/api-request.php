<?php

// Enable error reporting for debugging purposes
error_reporting(E_ALL);            // Report all types of errors
ini_set('display_errors', 1);      // Display errors in the output

// OpenAI API secret key (must be set before using the script)
$openAISecretKey = '';

// OpenAI API endpoint URL for chat completions
$openAIEndpoint = 'https://api.openai.com/v1/chat/completions';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Check if 'user_input' is set in the POST request
    if (isset($_POST['user_input'])) {
        $user_input = $_POST['user_input']; // Retrieve user input from POST data

        // Prepare the data payload for the OpenAI API
        $data = [
            'model' => 'gpt-3.5-turbo',    // Specify the OpenAI model to use
            'messages' => [                // Provide the conversation context
                [
                    'role' => 'user',      // User's role in the chat
                    'content' => $user_input // User's input message
                ]
            ],
            'temperature' => 0.7,          // Control randomness of responses
            'max_tokens' => 2000,          // Set the maximum number of tokens in the response
        ];

        // Initialize a cURL session for the API request
        $ch = curl_init();

        // Set cURL options
        curl_setopt($ch, CURLOPT_URL, $openAIEndpoint); // API endpoint
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);   // Return the response as a string
        curl_setopt($ch, CURLOPT_POST, 1);             // Use the POST method
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data)); // Set the JSON-encoded payload

        // Set the headers for the API request
        $headers = [
            'Content-Type: application/json',        // Specify JSON content type
            'Authorization: Bearer ' . $openAISecretKey // Include the OpenAI API secret key
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        // Execute the cURL request
        $response = curl_exec($ch);

        // Check for cURL errors
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch); // Display cURL error message
            exit;                            // Exit the script on error
        }

        // Decode the API response JSON into an associative array
        $responseData = json_decode($response, true);

        // Log the API response for debugging purposes
        error_log('API Response: ' . print_r($responseData, true));

        // Check if a valid response message exists in the API response
        if (isset($responseData['choices'][0]['message']['content'])) {
            // Send the valid response content back as a JSON object
            echo json_encode([
                'choices' => [
                    [
                        'message' => [
                            'content' => $responseData['choices'][0]['message']['content']
                        ]
                    ]
                ]
            ]);
        } else {
            // Send an error message if the response is invalid
            echo json_encode(['error' => 'Invalid response from OpenAI']);
        }

        // Close the cURL session
        curl_close($ch);
    } else {
        // Send an error message if 'user_input' is not provided
        echo json_encode(['error' => 'No user input received']);
    }
} else {
    // Send an error message for invalid request methods
    echo json_encode(['error' => 'Invalid request method']);
}
