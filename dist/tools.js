"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = void 0;
const esrever_1 = __importDefault(require("esrever"));
const extensions_1 = require("./extensions");
/**
 * @namespace Tools
 * @description A TypeScript module providing text analysis functionalities through various operations like removing punctuations, numbers, alphabets, special characters, extracting URLs, and performing case transformations. It also includes functions for character and alphanumeric counting.
 */
var Tools;
(function (Tools) {
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
    }
    ToolsConstant.regex = {
        alphabets: /[a-zA-Z]/g,
        numbers: /\d/g,
        punctuations: /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, // Simplified syntax
        specialCharacters: /[^a-zA-Z0-9\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g,
        urls: /https?:\/\/\S+/gi,
        newlines: /^\s*$(?:\r\n?|\n)/gm,
        extraSpaces: / +/g,
        character: /[^\s\p{Cf}]/gu,
        // Enhanced patterns
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phoneNumber: /(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/g,
        hashtags: /#[a-zA-Z0-9_]+/g,
        mentions: /@[a-zA-Z0-9_]+/g,
    };
    Tools.ToolsConstant = ToolsConstant;
    /**
     * @enum {string} Operations
     * @description Enum representing various text analysis and manipulation operations. Each operation corresponds to a specific functionality within the `Analyser` class.
     */
    let Operations;
    (function (Operations) {
        Operations["RemovePunctuations"] = "removepunc";
        Operations["RemoveNumbers"] = "removenum";
        Operations["RemoveAlphabets"] = "removealpha";
        Operations["RemoveSpecialChars"] = "removespecialchar";
        Operations["RemoveNewlines"] = "newlineremover";
        Operations["RemoveExtraSpaces"] = "extraspaceremover";
        Operations["ExtractUrls"] = "extractUrls";
        Operations["ExtractEmails"] = "extractEmails";
        Operations["ExtractPhoneNumbers"] = "extractPhoneNumbers";
        Operations["ExtractHashtags"] = "extractHashtags";
        Operations["ExtractMentions"] = "extractMentions";
        Operations["ConvertToUppercase"] = "fullcaps";
        Operations["ConvertToLowercase"] = "lowercaps";
        Operations["ConvertToTitleCase"] = "titlecase";
        Operations["CountCharacters"] = "charcount";
        Operations["CountAlphabets"] = "alphacount";
        Operations["CountNumbers"] = "numcount";
        Operations["CountAlphanumeric"] = "alphanumericcount";
        Operations["CountWords"] = "wordcount";
        Operations["CountSentences"] = "sentencecount";
        Operations["ReverseText"] = "reversetext";
        Operations["Truncate"] = "truncate";
        Operations["ExtractKeywords"] = "extractKeywords";
        Operations["AnalyzeSentiment"] = "analyzeSentiment";
        Operations["SummarizeText"] = "summarizeText";
        Operations["CalculateReadability"] = "calculateReadability";
        Operations["DetectLanguage"] = "detectLanguage";
        Operations["CompareTexts"] = "compareTexts";
    })(Operations = Tools.Operations || (Tools.Operations = {}));
    /**
     * @class Analyser
     * @summary A class to analyze and manipulate strings based on user-provided options.
     */
    class Analyser {
        /**
         * @constructor
         * @param {string} raw_text - The input text to process.
         * @param {AnalyserBuiltInOptions} options - The options object defining operations to perform.
         * @throws {Error} If raw_text is not a string
         */
        constructor(raw_text, options = {}) {
            this.count = 0;
            this.alphacount = 0;
            this.numericcount = 0;
            this.wordCount = 0;
            this.sentenceCount = 0;
            // Enhanced extraction features
            this.urls = [];
            this.emails = [];
            this.phoneNumbers = [];
            this.hashtags = [];
            this.mentions = [];
            this.keywords = []; // Store TF-IDF keywords
            this.metadata = {};
            this.operations = [];
            this.customOperationsList = [];
            this.builtInOperationsList = [];
            this.executionStartTime = 0;
            this.executionEndTime = 0;
            this.customOperations = {};
            this.builtInOptions = {};
            if (typeof raw_text !== "string") {
                throw new Error("Input text must be a string");
            }
            this.raw_text = raw_text || ""; // Fallback to empty string if raw_text is empty
            this.builtInOptions = options;
            // Initialize Extension Classes
            this.sentimentAnalyzer = new extensions_1.SentimentAnalyzer();
            this.keywordExtractor = new extensions_1.KeywordExtractor();
            this.textStats = new extensions_1.TextStatistics();
            this.languageDetector = new extensions_1.LanguageDetector();
            this.textDiff = new extensions_1.TextDiff();
        }
        /**
         * @static
         * @async
         * @function create
         * @summary Static Factory Method to initialize the Analyser with dynamic resources.
         * @description Ensures Lexicons and IDF maps are loaded before analysis begins[cite: 76, 79].
         * @param {string} raw_text - The input text.
         * @param {AnalyserBuiltInOptions} options - Configuration options.
         */
        static async create(raw_text, options = {}) {
            // Parallel loading of dynamic resources (Stopwords, IDF maps) [cite: 88, 174]
            await Promise.all([
                extensions_1.LexiconLoader.loadStopWords(),
                extensions_1.LexiconLoader.loadStandardIDF(),
            ]);
            return new Analyser(raw_text, options);
        }
        /** @summary Get all available operations */
        get availableOperations() {
            const customOps = Object.keys(this.customOperations).reduce((acc, key) => ({ ...acc, [key]: key }), {});
            return {
                ...Operations,
                ...customOps,
            };
        }
        /** @summary Get current options */
        get options() {
            return this.builtInOptions;
        }
        /** @summary Set new options */
        set options(newOptions) {
            this.builtInOptions = { ...this.builtInOptions, ...newOptions };
        }
        /**
         * @description Operation handlers mapping
         * @private
         */
        get operationHandlers() {
            return {
                [Operations.RemovePunctuations]: this.removePunctuations.bind(this),
                [Operations.RemoveNumbers]: this.removeNumbers.bind(this),
                [Operations.RemoveAlphabets]: this.removeAlphabets.bind(this),
                [Operations.RemoveSpecialChars]: this.removeSpecialCharacters.bind(this),
                [Operations.RemoveNewlines]: this.newLineRemover.bind(this),
                [Operations.RemoveExtraSpaces]: this.extraSpaceRemover.bind(this),
                [Operations.ExtractUrls]: this.extractURL.bind(this),
                [Operations.ExtractEmails]: this.extractEmails.bind(this),
                [Operations.ExtractPhoneNumbers]: this.extractPhoneNumbers.bind(this),
                [Operations.ExtractHashtags]: this.extractHashtags.bind(this),
                [Operations.ExtractMentions]: this.extractMentions.bind(this),
                [Operations.ConvertToUppercase]: this.toFullUppercase.bind(this),
                [Operations.ConvertToLowercase]: this.toFullLowercase.bind(this),
                [Operations.ConvertToTitleCase]: this.toTitleCase.bind(this),
                [Operations.CountCharacters]: this.countCharacters.bind(this),
                [Operations.CountAlphabets]: this.countAlphas.bind(this),
                [Operations.CountNumbers]: this.countNums.bind(this),
                [Operations.CountAlphanumeric]: this.countAlphaNumeric.bind(this),
                [Operations.CountWords]: this.countWords.bind(this),
                [Operations.CountSentences]: this.countSentences.bind(this),
                [Operations.ReverseText]: this.reverseText.bind(this),
                [Operations.Truncate]: this.truncateText.bind(this),
                [Operations.ExtractKeywords]: this.extractKeywords.bind(this),
                [Operations.AnalyzeSentiment]: this.analyzeSentiment.bind(this),
                [Operations.CalculateReadability]: this.calculateReadability.bind(this),
                [Operations.DetectLanguage]: this.detectLanguage.bind(this),
                [Operations.CompareTexts]: this.compareTexts.bind(this),
                ...this.customOperations,
            };
        }
        /**
         * @private
         * @async
         * @function removeAlphabets
         * @summary Removes all alphabetic characters from the input text.
         */
        async removeAlphabets() {
            this.raw_text = this.raw_text.replace(ToolsConstant.regex.alphabets, "");
            this.logOperation("Removed Alphabets");
        }
        /**
         * @private
         * @async
         * @function removeNumbers
         * @summary Removes all numeric characters from the input text.
         */
        async removeNumbers() {
            this.raw_text = this.raw_text.replace(ToolsConstant.regex.numbers, "");
            this.logOperation("Removed Numbers");
        }
        /**
         * @private
         * @async
         * @function removePunctuations
         * @summary Removes all punctuation characters from the input text.
         */
        async removePunctuations() {
            this.raw_text = this.raw_text.replace(ToolsConstant.regex.punctuations, "");
            this.logOperation("Removed Punctuations");
        }
        /**
         * @private
         * @async
         * @function removeSpecialCharacters
         * @summary Removes all special characters from the input text.
         */
        async removeSpecialCharacters() {
            this.raw_text = this.raw_text.replace(ToolsConstant.regex.specialCharacters, "");
            this.logOperation("Removed Special Characters");
        }
        /**
         * @private
         * @async
         * @function extraSpaceRemover
         * @summary Removes extra spaces and trims the input text.
         */
        async extraSpaceRemover() {
            this.raw_text = this.raw_text
                .replace(ToolsConstant.regex.extraSpaces, " ")
                .trim();
            this.logOperation("Removed Extra Spaces");
        }
        /**
         * @private
         * @async
         * @function newLineRemover
         * @summary Removes newline characters from the input text.
         */
        async newLineRemover() {
            this.raw_text = this.raw_text
                .replace(ToolsConstant.regex.newlines, "\n")
                .trim();
            this.logOperation("Removed New Line Characters");
        }
        /**
         * @private
         * @async
         * @function extractURL
         * @summary Extracts all URLs from the input text.
         */
        async extractURL() {
            this.urls = this.raw_text.match(ToolsConstant.regex.urls) || [];
            this.logOperation("Extracted URLs");
        }
        /**
         * @private
         * @async
         * @function extractEmails
         * @summary Extracts all email addresses from the input text.
         */
        async extractEmails() {
            this.emails = this.raw_text.match(ToolsConstant.regex.email) || [];
            this.logOperation("Extracted Emails");
        }
        /**
         * @private
         * @async
         * @function extractPhoneNumbers
         * @summary Extracts all phone numbers from the input text.
         */
        async extractPhoneNumbers() {
            this.phoneNumbers =
                this.raw_text.match(ToolsConstant.regex.phoneNumber) || [];
            this.logOperation("Extracted Phone Numbers");
        }
        /**
         * @private
         * @async
         * @function extractHashtags
         * @summary Extracts all hashtags from the input text.
         */
        async extractHashtags() {
            this.hashtags = this.raw_text.match(ToolsConstant.regex.hashtags) || [];
            this.logOperation("Extracted Hashtags");
        }
        /**
         * @private
         * @async
         * @function extractMentions
         * @summary Extracts all mentions from the input text.
         */
        async extractMentions() {
            this.mentions = this.raw_text.match(ToolsConstant.regex.mentions) || [];
            this.logOperation("Extracted Mentions");
        }
        /**
         * @private
         * @async
         * @function toFullUppercase
         * @summary Converts all characters in the input text to uppercase.
         */
        async toFullUppercase() {
            this.raw_text = this.raw_text.toUpperCase();
            this.logOperation("Changed to Uppercase");
        }
        /**
         * @private
         * @async
         * @function toFullLowercase
         * @summary Converts all characters in the input text to lowercase.
         */
        async toFullLowercase() {
            this.raw_text = this.raw_text.toLowerCase();
            this.logOperation("Changed to Lowercase");
        }
        /**
         * @private
         * @async
         * @function toTitleCase
         * @summary Converts the input text to title case (first letter of each word capitalized).
         */
        async toTitleCase() {
            this.raw_text = this.raw_text.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
            });
            this.logOperation("Changed to Title Case");
        }
        /**
         * @private
         * @async
         * @function countCharacters
         * @summary Counts the number of non-whitespace characters in the input text.
         */
        async countCharacters() {
            this.count = (this.raw_text.match(ToolsConstant.regex.character) ?? []).length;
            this.logOperation("Counted Characters");
        }
        /**
         * @private
         * @async
         * @function countAlphas
         * @summary Counts the number of alphabets in the input text.
         */
        async countAlphas() {
            this.alphacount = (this.raw_text.match(ToolsConstant.regex.alphabets) || []).length;
            this.logOperation("Counted Alphabets");
        }
        /**
         * @private
         * @async
         * @function countNums
         * @summary Counts the number of numeric characters in the input text.
         */
        async countNums() {
            this.numericcount = (this.raw_text.match(ToolsConstant.regex.numbers) || []).length;
            this.logOperation("Counted Numbers");
        }
        /**
         * @private
         * @async
         * @function countAlphaNumeric
         * @summary Counts the number of alphabetic and numeric characters in the input text.
         */
        async countAlphaNumeric() {
            this.alphacount = (this.raw_text.match(ToolsConstant.regex.alphabets) || []).length;
            this.numericcount = (this.raw_text.match(ToolsConstant.regex.numbers) || []).length;
            this.logOperation("Counted Alphabets and Numbers");
        }
        /**
         * @private
         * @async
         * @function countWords
         * @summary Counts the number of words in the input text.
         */
        async countWords() {
            // Count words by splitting on whitespace and filtering out empty strings
            const words = this.raw_text
                .trim()
                .split(/\s+/)
                .filter((word) => word.length > 0);
            this.wordCount = words.length;
            this.logOperation("Counted Words");
        }
        /**
         * @private
         * @async
         * @function countSentences
         * @summary Counts the number of sentences in the input text.
         */
        async countSentences() {
            const trimmed = this.raw_text.trim();
            if (!trimmed) {
                this.sentenceCount = 0;
                this.logOperation("Counted Sentences");
                return;
            }
            // Match sentences: any text followed by .!? (with optional following whitespace)
            // OR any remaining text at the end (incomplete sentence)
            const sentencePattern = /[^.!?]+[.!?]+/g;
            const matches = trimmed.match(sentencePattern) || [];
            // Check if there's remaining text after the last punctuation
            const lastMatch = matches[matches.length - 1];
            const hasTrailingText = lastMatch
                ? trimmed.lastIndexOf(lastMatch) + lastMatch.length < trimmed.length
                : trimmed.length > 0;
            this.sentenceCount = matches.length + (hasTrailingText ? 1 : 0);
            this.logOperation("Counted Sentences");
        }
        /**
         * @private
         * @async
         * @function reverseText
         * @summary Reverses the input text.
         */
        async reverseText() {
            this.raw_text = esrever_1.default.reverse(this.raw_text);
            this.logOperation("Reversed Text");
        }
        /**
         * @private
         * @async
         * @function truncateText
         * @summary Truncates the input text to a specified length.
         */
        async truncateText() {
            const config = this.builtInOptions[Operations.Truncate];
            if (!config || typeof config !== "object" || !config.maxLength) {
                throw new Error("Truncate operation requires a valid configuration with maxLength");
            }
            const { maxLength, suffix = "..." } = config;
            if (this.raw_text.length <= maxLength) {
                return; // No truncation needed
            }
            this.raw_text = this.raw_text.substring(0, maxLength) + suffix;
            this.logOperation(`Truncated Text to ${maxLength} characters`);
        }
        /**
         * @private
         * @async
         * @function extractKeywords
         * @summary Extracts keywords using TF-IDF logic.
         * @description Moves beyond counting to semantic analysis[cite: 161].
         */
        async extractKeywords() {
            // Default to top 5 keywords, or use user config
            const options = this.builtInOptions[Operations.ExtractKeywords];
            const topN = typeof options === "object" && options.topN ? options.topN : 5;
            this.keywords = this.keywordExtractor.extractKeywords(this.raw_text, topN);
            this.logOperation(`Extracted Top ${topN} Keywords (TF-IDF)`);
        }
        /**
         * @private
         * @async
         * @function analyzeSentiment
         * @summary Analyzes the sentiment of the input text.
         */
        async analyzeSentiment() {
            const result = this.sentimentAnalyzer.analyze(this.raw_text);
            this.sentiment = result;
            this.logOperation("Analysed Sentiment");
        }
        /**
         * @private
         * @async
         * @function calculateReadability
         * @summary Calculates readability metrics including Flesch-Kincaid and SMOG.
         * @description Implements advanced morphological metrics[cite: 139].
         */
        async calculateReadability() {
            const result = this.textStats.fleschKincaidReadability(this.raw_text);
            this.readability = result;
            this.logOperation("Calculated readability Metrics (Flesch-Kincaid & SMOG)");
        }
        /**
         * @private
         * @async
         * @function detectLanguage
         * @summary Detects language using n-gram profiles.
         */
        async detectLanguage() {
            const detectionResult = this.languageDetector.detect(this.raw_text);
            this.language = detectionResult;
            this.logOperation(`Detected Language: ${detectionResult.detectedLanguage}`);
        }
        /**
         * @private
         * @async
         * @function compareTexts
         * @summary Compares two texts using basic diff logic.
         */
        async compareTexts() {
            const compareOptions = this.builtInOptions[Operations.CompareTexts];
            if (!compareOptions ||
                typeof compareOptions !== "object" ||
                !("compareWith" in compareOptions)) {
                throw new Error("CompareTexts operation requires a 'compareWith' text");
            }
            const compareWith = compareOptions.compareWith;
            const comparisonResult = this.textDiff.compare(this.raw_text, compareWith);
            this.comparison = comparisonResult;
            this.logOperation(`Compared Texts (${comparisonResult.similarity.toFixed(2)}% similarity)`);
        }
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
        async addCustomOperation(commandName, logName, config) {
            if (!commandName || typeof commandName !== "string")
                throw new Error("Command name must be a non-empty string");
            if (!logName || typeof logName !== "string")
                throw new Error("Log name must be a non-empty string");
            if (typeof config.operation !== "function")
                throw new Error("Operation must be a function");
            if (Operations[commandName] ||
                this.customOperations[commandName]) {
                throw new Error(`Operation "${commandName}" already exists`);
            }
            this.customOperations[commandName] = async () => {
                try {
                    const originalText = this.raw_text;
                    this.raw_text = config.operation(this.raw_text);
                    this.logOperation(`${logName}`, true);
                    // Initialize custom metadata object if it doesn't exist
                    if (!this.metadata.custom) {
                        this.metadata.custom = {};
                    }
                    // Initialize this operation's metadata object if it doesn't exist
                    if (!this.metadata.custom[commandName]) {
                        this.metadata.custom[commandName] = {};
                    }
                    // Merge static metadata if provided
                    if (config.metadata) {
                        this.metadata.custom[commandName] = {
                            ...this.metadata.custom[commandName],
                            ...config.metadata,
                        };
                    }
                    // Extract and merge dynamic metadata if extractor provided
                    if (config.metadataExtractor) {
                        const extractedMetadata = config.metadataExtractor(originalText);
                        this.metadata.custom[commandName] = {
                            ...this.metadata.custom[commandName],
                            ...extractedMetadata,
                        };
                    }
                }
                catch (error) {
                    this.logOperation(`Error in Custom Operation: ${logName} - ${error}`, true);
                    throw error;
                }
            };
            this.builtInOptions[commandName] = config.isEnabled ?? false;
        }
        /**
         * @function toggleOperation
         * @summary Toggles an operation on or off.
         * @param {string} commandName - The name of the operation to toggle.
         * @param {boolean} isEnabled - Whether to enable the operation.
         * @returns {Promise<void>} Resolves when the operation is successfully toggled.
         * @throws {Error} If the operation does not exist or is already in the requested state.
         */
        async toggleOperation(commandName, isEnabled) {
            if (!(commandName in this.builtInOptions) &&
                !(commandName in Operations) &&
                !(commandName in this.customOperations)) {
                throw new Error(`Operation "${commandName}" not found. Please add it first.`);
            }
            if (this.builtInOptions[commandName] === isEnabled)
                return;
            this.builtInOptions[commandName] = isEnabled;
        }
        /**
         * @function enableAllOperations
         * @summary Enables all available operations.
         * @returns {Promise<void>} Resolves when all operations are enabled.
         */
        async enableAllOperations() {
            // Enable all built-in operations 
            for (const operation in Operations) {
                if (isNaN(Number(operation))) {
                    // Set both the enum name (key) and the enum value
                    this.builtInOptions[operation] = true;
                    this.builtInOptions[Operations[operation]] = true;
                }
            }
            // Enable all custom operations
            for (const operation in this.customOperations) {
                this.builtInOptions[operation] = true;
            }
        }
        /**
         * @function disableAllOperations
         * @summary Disables all operations.
         * @returns {Promise<void>} Resolves when all operations are disabled.
         */
        async disableAllOperations() {
            // Disable all built-in operations
            for (const operation in Operations) {
                if (isNaN(Number(operation))) {
                    // Set both the enum name (key) and the enum value
                    this.builtInOptions[operation] = false;
                    this.builtInOptions[Operations[operation]] = false;
                }
            }
            // Disable all custom operations
            for (const operation in this.customOperations) {
                this.builtInOptions[operation] = false;
            }
        }
        /**
         * @function resetText
         * @summary Resets the text to the original value or a new value.
         * @param {string} [newText] - Optional new text to set.
         * @returns {Promise<void>} Resolves when the text is reset.
         */
        async resetText(newText) {
            if (newText !== undefined) {
                if (typeof newText !== "string") {
                    throw new Error("New text must be a string");
                }
                this.raw_text = newText;
            }
            // Reset all counters and extracted data
            this.count = 0;
            this.alphacount = 0;
            this.numericcount = 0;
            this.wordCount = 0;
            this.sentenceCount = 0;
            this.urls = [];
            this.emails = [];
            this.phoneNumbers = [];
            this.hashtags = [];
            this.keywords = [];
            this.mentions = [];
            // Reset operations log
            this.operations = [];
            this.logOperation("Text Reset");
        }
        /**
         * @private
         * @function logOperation
         * @summary Logs the performed operation.
         * @param {string} operation - The operation performed on the text.
         * @param {string} isCustom - Whether the operation is a custom function.
         */
        logOperation(operation, isCustom = false) {
            this.operations.push(operation);
            if (isCustom) {
                this.customOperationsList.push(operation);
            }
            else {
                this.builtInOperationsList.push(operation);
            }
        }
        /**
         * @private
         * @async
         * @function getResults
         * @summary Retrieves the results of the operations performed on the text.
         * @returns {Promise<AnalyserResult>} An object containing the results of the analysis.
         */
        async getResults() {
            const executionTime = this.executionEndTime - this.executionStartTime;
            const result = {
                purpose: this.operations.join(","),
                output: this.raw_text,
                operations: [...this.operations],
                builtInOperations: [...this.builtInOperationsList],
                customOperations: [...this.customOperationsList],
                executionTime,
                metadata: {
                    counts: {
                        characterCount: this.count,
                        alphabetCount: this.alphacount,
                        numericCount: this.numericcount,
                        wordCount: this.wordCount,
                        sentenceCount: this.sentenceCount,
                    },
                    urls: this.urls,
                    emails: this.emails,
                    phoneNumbers: this.phoneNumbers,
                    hashtags: this.hashtags,
                    mentions: this.mentions,
                    keywords: this.keywords,
                    readability: this.readability,
                    sentiment: this.sentiment,
                    languageDetection: this.language,
                    textComparison: this.comparison,
                    custom: { ...this.metadata.custom },
                },
            };
            return result;
        }
        /**
         * @async
         * @function main
         * @summary Executes the text analysis operations based on the provided options.
         * @returns {Promise<AnalyserResult>} An object containing the analysis results.
         * @throws {Error} If an operation fails.
         */
        async main() {
            this.executionStartTime = performance.now();
            try {
                for (const [operation, enabled] of Object.entries(this.builtInOptions)) {
                    if (enabled) {
                        // First check if it's a custom operation
                        const customHandler = this.customOperations[operation];
                        if (customHandler) {
                            await customHandler();
                            continue;
                        }
                        // Otherwise, check for built-in operation handler
                        const handler = this.operationHandlers[operation];
                        if (handler) {
                            await handler();
                        }
                        else {
                            console.warn(`No handler found for operation: ${operation}`);
                        }
                    }
                }
            }
            catch (error) {
                this.logOperation(`Error: ${error instanceof Error ? error.message : String(error)}`);
                throw error;
            }
            finally {
                this.executionEndTime = performance.now();
            }
            return this.getResults();
        }
        /**
         * @static
         * @function createWithEnabledOperations
         * @summary Factory method to create an Analyser instance with specific operations enabled.
         * @param {string} text - The text to analyze.
         * @param {(keyof typeof Operations)[]} operations - The operations to enable.
         * @returns {Analyser} A new Analyser instance with the specified operations enabled.
         */
        static createWithEnabledOperations(text, operations) {
            const options = {};
            for (const operation of operations) {
                if (Operations[operation]) {
                    options[Operations[operation]] = true;
                }
            }
            return new Analyser(text, options);
        }
        /**
         * @static
         * @function batch
         * @summary Process multiple strings with the same operations.
         * @param {string[]} texts - Array of strings to process.
         * @param {AnalyserBuiltInOptions} options - Operations to apply to all texts.
         * @returns {Promise<AnalyserResult[]>} Array of results for each text.
         */
        static async batch(texts, options) {
            if (!Array.isArray(texts)) {
                throw new Error("Texts must be an array of strings");
            }
            // Ensure shared resources (IDF/Stopwords) are loaded once before batch processing
            await Promise.all([
                extensions_1.LexiconLoader.loadStopWords(),
                extensions_1.LexiconLoader.loadStandardIDF(),
            ]);
            const results = [];
            for (const text of texts) {
                const analyser = new Analyser(text, options);
                const result = await analyser.main();
                results.push(result);
            }
            return results;
        }
    }
    Tools.Analyser = Analyser;
})(Tools || (exports.Tools = Tools = {}));
