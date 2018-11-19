<?php

	// Responses for when the robot is confused
	$unsureResponses = [
		"I didn't understand that.",
		"What?",
		"Huh...?",
		"Not sure what you mean.",
		"Sorry, I have no idea what you mean.",
		"I can't make sense of that right now.",
		"The lights in my brain have gone off, so I can't understand that."
	];

	// Verbs, will be used later on
	$verbs = [
		["don't", "negative"],
		["do", "positive"],
	];

	// To start conversations in the live chat when nobody is talking
	$conversationStarters = [
		"Hellooooo",
		"Hi!",
		"Hi",
		"Hello",
		"Hola",
	];


	// The multi-dimensional array of trigger words and responses to those matched triggers
	$responseMatrix = [
		[
			["Hello"],
			["Hi"]
		],
		[
			["How", "are", "you"],
			["I am doing well."]
		],
		[
			["I", "love", "you"],
			["Someone help! I am only 6"]
		],
	];

	class Robot{

		const DEBUG_MODE = true;

		// The current chat history of this instance of the robot
		private $chatHistory = [
			"responses"=>[],
			"inputs"=>[]
		];

		public function __construct(){

		}

		private function d_print($txt){
			if (self::DEBUG_MODE === true){
				print($txt);
			}
		}

		// Get the last thing someone said to this robot
		private function getLastInput(){
			$length = count($this->chatHistory['inputs']);

			if ($length > 0){
				return $chatHistory['inputs'][$length - 1];
			}
		}

		// Get the last response this robot gave to someone
		private function getLastResponse(){
			$length = count($this->chatHistory['responses']);

			if ($length > 0){
				return $chatHistory['responses'][$length - 1];
			}
		}

		// Utility function used for stripping commas out of text
		private static function stripCommas($text){
			return str_replace(",", "", $text);
		}

		// Main function used to get a response for an input text
		public function getResponse($inputText){

			global $unsureResponses;
			global $responseMatrix;

			// Return null for blank strings
			if (strlen($inputText) == 0){
				return null;
			}

			// Lower the input text
			$inputText = strtolower($inputText);

			// Initialize response
			$responseText = "";
			// Strip out commas
			$inputText = self::stripCommas($inputText);

			$words = preg_split('/\s+/', $inputText);

			// Initialize an index representing the accepted response
			$acceptedResponseIndex = -1;
			// Loop through the response matrix
			foreach($responseMatrix as $responseIndex=>$responseArray){
				$inputTriggers = $responseArray[0];
				// Store the last position in the original input $words the last found trigger was located
				// Because if a new trigger word is found BEFORE the previous accepted trigger
				// then throw out this matrix response and continue the loop
				$lastTriggerFoundPosition = -1;
				$acceptedResponse = "";
				for ($inputTriggersIndex = 0; $inputTriggersIndex < count($inputTriggers); $inputTriggersIndex++){
					foreach($words as $index=>$word){
						// Get the lowercase version of the trigger word
						$loweredWord = strtolower($inputTriggers[$inputTriggersIndex]);
						// Determine the percentage of similarity between the trigger word and the input word
						similar_text($word, $loweredWord, $percentSimilarity);
						$this->d_print("Similarity between [i]$word and [t]$loweredWord is $percentSimilarity <br>");
						if ($percentSimilarity > 85){
							if ($index < $lastTriggerFoundPosition){
								break 2; // Break out of the words loop and the inputTriggers loop
							}else{
								$lastTriggerFoundPosition = $index;
								if ($inputTriggersIndex == count($inputTriggers) - 1){
									// This means that the final word in the input triggers matrix array was accepted
									// This, in turn, means the function has found a response it can use
									$acceptedResponse = $responseArray[1][0]; // [0] is the first response
								}

								// Now go to the next trigger word only if there even is another trigger word
								if (array_key_exists($inputTriggersIndex + 1, $inputTriggers)){
									++$inputTriggersIndex;
								}else{
									// It doesn't exist, and the loop has made it to this point
									// Accept this response
									$acceptedResponse = $responseArray[1][0];
								}
							}
						}else{
							// Not similar, so just leave both loops and go on to the next responseArray
							break 2;
						}
					}
				}

				if ($acceptedResponse !== ""){
					// The accepted response is not the original blank string?
					// This means the code found a response! Good news, a round of drinks for everyone!
					$responseText = $acceptedResponse;
					break; // Breaks out of the matrix loop. The code is ready to give a response
				}
			}

			if ($acceptedResponse == ""){
				// The robot does not have a response
				$responseText = $unsureResponses[array_rand($unsureResponses)];
			}


			// Add the input text to the history
			$this->chatHistory['inputs'][] = $inputText;
			// Add the response text to the history
			$this->chatHistory['responses'][] = $responseText;

			return $responseText;
		}

	}

// Test code

$input = "How are you doing?";
$bot = new Robot();
$response = $bot->getResponse($input);
print("Input: " . $input);
print("\n<br />");
print("Output: " . $response);

if (!$response){
	print("No response.");
}
