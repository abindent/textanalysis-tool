import { type SentimentResult, type ReadabilityResult, type TextDiffResult, type LanguageDetectionResult } from "./extensions";
/**
 * @namespace Tools
 * @description A TypeScript module providing text analysis functionalities through various operations like removing punctuations, numbers, alphabets, special characters, extracting URLs, and performing case transformations. It also includes functions for character and alphanumeric counting.
 */
export declare namespace Tools {
    /**
     * @class ToolsConstant
     * @summary A collection of regular expressions for different character patterns.
     * @readonly
     * @property {Object} regex - An object containing regex patterns.
     * @property {RegExp} regex.alphabets - Matches all alphabetical characters (both uppercase and lowercase).
     * @property {RegExp} regex.numbers - Matches all numeric digits (0-9).
     * @property {RegExp} regex.punctuations - Matches common punctuation characters.
     * @property {RegExp} regex.specialCharacters - Matches any special characters that are not alphanumeric or common punctuation.
     * @property {RegExp} regex.urls - Matches URLs that start with "http" or "https".
     * @property {RegExp} regex.newlines - Matches empty lines (newlines with only whitespace).
     * @property {RegExp} regex.extraSpaces - Matches multiple consecutive spaces.
     * @property {RegExp} regex.character - Matches whitespace characters.
     */
    class ToolsConstant {
        static readonly regex: {
            alphabets: RegExp;
            numbers: RegExp;
            punctuations: RegExp;
            specialCharacters: RegExp;
            urls: RegExp;
            newlines: RegExp;
            extraSpaces: RegExp;
            character: RegExp;
            email: RegExp;
            phoneNumber: RegExp;
            hashtags: RegExp;
            mentions: RegExp;
        };
    }
    /**
     * @enum {string} Operations
     * @description Enum representing various text analysis and manipulation operations. Each operation corresponds to a specific functionality within the `Analyser` class.
     */
    enum Operations {
        RemovePunctuations = "removepunc",
        RemoveNumbers = "removenum",
        RemoveAlphabets = "removealpha",
        RemoveSpecialChars = "removespecialchar",
        RemoveNewlines = "newlineremover",
        RemoveExtraSpaces = "extraspaceremover",
        ExtractUrls = "extractUrls",
        ExtractEmails = "extractEmails",
        ExtractPhoneNumbers = "extractPhoneNumbers",
        ExtractHashtags = "extractHashtags",
        ExtractMentions = "extractMentions",
        ConvertToUppercase = "fullcaps",
        ConvertToLowercase = "lowercaps",
        ConvertToTitleCase = "titlecase",
        CountCharacters = "charcount",
        CountAlphabets = "alphacount",
        CountNumbers = "numcount",
        CountAlphanumeric = "alphanumericcount",
        CountWords = "wordcount",
        CountSentences = "sentencecount",
        ReverseText = "reversetext",
        Truncate = "truncate",
        ExtractKeywords = "extractKeywords",
        AnalyzeSentiment = "analyzeSentiment",
        CalculateReadability = "calculateReadability",
        DetectLanguage = "detectLanguage",
        CompareTexts = "compareTexts"
    }
    /** Types for Analyser options and built-in operations */
    type AnalyserBuiltInOptions = Partial<Record<Operations | string, boolean | any>>;
    /** Type for operation results */
    interface AnalyserResult {
        purpose: string;
        output: string;
        metadata: {
            counts: {
                characterCount: number;
                alphabetCount: number;
                numericCount: number;
                wordCount?: number;
                sentenceCount?: number;
            };
            urls?: string[];
            emails?: string[];
            phoneNumbers?: string[];
            hashtags?: string[];
            mentions?: string[];
            keywords?: string[];
            readability?: ReadabilityResult;
            sentiment?: SentimentResult;
            languageDetection?: LanguageDetectionResult;
            textComparison?: TextDiffResult;
            custom?: {
                [key: string]: any;
            };
        };
        [key: string]: any;
        operations: string[];
        builtInOperations: string[];
        customOperations: string[];
        executionTime?: number;
    }
    /** Configuration type for Truncate operation */
    interface TruncateConfig {
        maxLength: number;
        suffix?: string;
    }
    /**
     * @class Analyser
     * @summary A class to analyze and manipulate strings based on user-provided options.
     */
    class Analyser {
        raw_text: string;
        output: string;
        count: number;
        alphacount: number;
        numericcount: number;
        wordCount: number;
        sentenceCount: number;
        urls: string[];
        emails: string[];
        phoneNumbers: string[];
        hashtags: string[];
        mentions: string[];
        keywords: string[];
        private metadata;
        private readability;
        private sentiment;
        private language;
        private comparison;
        operations: string[];
        customOperationsList: string[];
        builtInOperationsList: string[];
        private executionStartTime;
        private executionEndTime;
        private customOperations;
        private builtInOptions;
        private sentimentAnalyzer;
        private keywordExtractor;
        private textStats;
        private languageDetector;
        private textDiff;
        /**
         * @constructor
         * @param {string} raw_text - The input text to process.
         * @param {AnalyserBuiltInOptions} options - The options object defining operations to perform.
         * @throws {Error} If raw_text is not a string
         */
        constructor(raw_text: string, options?: AnalyserBuiltInOptions);
        /**
         * @static
         * @async
         * @function create
         * @summary Static Factory Method to initialize the Analyser with dynamic resources.
         * @description Ensures Lexicons and IDF maps are loaded before analysis begins[cite: 76, 79].
         * @param {string} raw_text - The input text.
         * @param {AnalyserBuiltInOptions} options - Configuration options.
         */
        static create(raw_text: string, options?: AnalyserBuiltInOptions): Promise<Analyser>;
        /** @summary Get all available operations */
        get availableOperations(): Record<string, string>;
        /** @summary Get current options */
        get options(): AnalyserBuiltInOptions;
        /** @summary Set new options */
        set options(newOptions: AnalyserBuiltInOptions);
        /**
         * @description Operation handlers mapping
         * @private
         */
        private get operationHandlers();
        /**
         * @private
         * @async
         * @function removeAlphabets
         * @summary Removes all alphabetic characters from the input text.
         */
        private removeAlphabets;
        /**
         * @private
         * @async
         * @function removeNumbers
         * @summary Removes all numeric characters from the input text.
         */
        private removeNumbers;
        /**
         * @private
         * @async
         * @function removePunctuations
         * @summary Removes all punctuation characters from the input text.
         */
        private removePunctuations;
        /**
         * @private
         * @async
         * @function removeSpecialCharacters
         * @summary Removes all special characters from the input text.
         */
        private removeSpecialCharacters;
        /**
         * @private
         * @async
         * @function extraSpaceRemover
         * @summary Removes extra spaces and trims the input text.
         */
        private extraSpaceRemover;
        /**
         * @private
         * @async
         * @function newLineRemover
         * @summary Removes newline characters from the input text.
         */
        private newLineRemover;
        /**
         * @private
         * @async
         * @function extractURL
         * @summary Extracts all URLs from the input text.
         */
        private extractURL;
        /**
         * @private
         * @async
         * @function extractEmails
         * @summary Extracts all email addresses from the input text.
         */
        private extractEmails;
        /**
         * @private
         * @async
         * @function extractPhoneNumbers
         * @summary Extracts all phone numbers from the input text.
         */
        private extractPhoneNumbers;
        /**
         * @private
         * @async
         * @function extractHashtags
         * @summary Extracts all hashtags from the input text.
         */
        private extractHashtags;
        /**
         * @private
         * @async
         * @function extractMentions
         * @summary Extracts all mentions from the input text.
         */
        private extractMentions;
        /**
         * @private
         * @async
         * @function toFullUppercase
         * @summary Converts all characters in the input text to uppercase.
         */
        private toFullUppercase;
        /**
         * @private
         * @async
         * @function toFullLowercase
         * @summary Converts all characters in the input text to lowercase.
         */
        private toFullLowercase;
        /**
         * @private
         * @async
         * @function toTitleCase
         * @summary Converts the input text to title case (first letter of each word capitalized).
         */
        private toTitleCase;
        /**
         * @private
         * @async
         * @function countCharacters
         * @summary Counts the number of non-whitespace characters in the input text.
         */
        private countCharacters;
        /**
         * @private
         * @async
         * @function countAlphas
         * @summary Counts the number of alphabets in the input text.
         */
        private countAlphas;
        /**
         * @private
         * @async
         * @function countNums
         * @summary Counts the number of numeric characters in the input text.
         */
        private countNums;
        /**
         * @private
         * @async
         * @function countAlphaNumeric
         * @summary Counts the number of alphabetic and numeric characters in the input text.
         */
        private countAlphaNumeric;
        /**
         * @private
         * @async
         * @function countWords
         * @summary Counts the number of words in the input text.
         */
        private countWords;
        /**
         * @private
         * @async
         * @function countSentences
         * @summary Counts the number of sentences in the input text.
         */
        private countSentences;
        /**
         * @private
         * @async
         * @function reverseText
         * @summary Reverses the input text.
         */
        private reverseText;
        /**
         * @private
         * @async
         * @function truncateText
         * @summary Truncates the input text to a specified length.
         */
        private truncateText;
        /**
         * @private
         * @async
         * @function extractKeywords
         * @summary Extracts keywords using TF-IDF logic.
         * @description Moves beyond counting to semantic analysis[cite: 161].
         */
        private extractKeywords;
        /**
         * @private
         * @async
         * @function analyzeSentiment
         * @summary Analyzes the sentiment of the input text.
         */
        private analyzeSentiment;
        /**
         * @private
         * @async
         * @function calculateReadability
         * @summary Calculates readability metrics including Flesch-Kincaid and SMOG.
         * @description Implements advanced morphological metrics[cite: 139].
         */
        private calculateReadability;
        /**
         * @private
         * @async
         * @function detectLanguage
         * @summary Detects language using n-gram profiles.
         */
        private detectLanguage;
        /**
         * @private
         * @async
         * @function compareTexts
         * @summary Compares two texts using basic diff logic.
         */
        private compareTexts;
        /**
         * @function addCustomOperation
         * @summary Adds a custom text operation to the analyser dynamically.
         * @param {string} commandName - The name of the custom operation to be registered.
         * @param {string} logName - The logging name of the custom operation to be registered.
         * @param {Object} config - Configuration object for the custom operation.
         * @param {(text: string) => string} config.operation - A function that performs the custom operation on the text.
         * @param {boolean} [config.isEnabled=false] - Whether to enable the operation immediately.
         * @param {Object} [config.metadata] - Optional metadata to be added to the result.
         * @param {(text: string) => any} [config.metadataExtractor] - Optional function to extract additional metadata.
         *
         * @returns {Promise<void>} Resolves when the custom operation is successfully added.
         * @throws {Error} If the commandName already exists or if parameters are invalid.
         */
        addCustomOperation(commandName: string, logName: string, config: {
            operation: (text: string) => string;
            isEnabled?: boolean;
            metadata?: {
                [key: string]: any;
            };
            metadataExtractor?: (text: string) => any;
        }): Promise<void>;
        /**
         * @function toggleOperation
         * @summary Toggles an operation on or off.
         * @param {string} commandName - The name of the operation to toggle.
         * @param {boolean} isEnabled - Whether to enable the operation.
         * @returns {Promise<void>} Resolves when the operation is successfully toggled.
         * @throws {Error} If the operation does not exist or is already in the requested state.
         */
        toggleOperation(commandName: string, isEnabled: boolean): Promise<void>;
        /**
         * @function enableAllOperations
         * @summary Enables all available operations.
         * @returns {Promise<void>} Resolves when all operations are enabled.
         */
        enableAllOperations(): Promise<void>;
        /**
         * @function disableAllOperations
         * @summary Disables all operations.
         * @returns {Promise<void>} Resolves when all operations are disabled.
         */
        disableAllOperations(): Promise<void>;
        /**
         * @function resetText
         * @summary Resets the text to the original value or a new value.
         * @param {string} [newText] - Optional new text to set.
         * @returns {Promise<void>} Resolves when the text is reset.
         */
        resetText(newText?: string): Promise<void>;
        /**
         * @private
         * @function logOperation
         * @summary Logs the performed operation.
         * @param {string} operation - The operation performed on the text.
         * @param {string} isCustom - Whether the operation is a custom function.
         */
        private logOperation;
        /**
         * @private
         * @async
         * @function getResults
         * @summary Retrieves the results of the operations performed on the text.
         * @returns {Promise<AnalyserResult>} An object containing the results of the analysis.
         */
        private getResults;
        /**
         * @async
         * @function main
         * @summary Executes the text analysis operations based on the provided options.
         * @returns {Promise<AnalyserResult>} An object containing the analysis results.
         * @throws {Error} If an operation fails.
         */
        main(): Promise<AnalyserResult>;
        /**
         * @static
         * @function createWithEnabledOperations
         * @summary Factory method to create an Analyser instance with specific operations enabled.
         * @param {string} text - The text to analyze.
         * @param {(keyof typeof Operations)[]} operations - The operations to enable.
         * @returns {Analyser} A new Analyser instance with the specified operations enabled.
         */
        static createWithEnabledOperations(text: string, operations: (keyof typeof Operations)[]): Analyser;
        /**
         * @static
         * @function batch
         * @summary Process multiple strings with the same operations.
         * @param {string[]} texts - Array of strings to process.
         * @param {AnalyserBuiltInOptions} options - Operations to apply to all texts.
         * @returns {Promise<AnalyserResult[]>} Array of results for each text.
         */
        static batch(texts: string[], options: AnalyserBuiltInOptions): Promise<AnalyserResult[]>;
    }
}
