"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextDiff = exports.LanguageDetector = exports.TextStatistics = exports.KeywordExtractor = exports.SentimentAnalyzer = exports.LexiconLoader = void 0;
const natural_1 = __importDefault(require("natural"));
const compromise_1 = __importDefault(require("compromise"));
const franc_1 = require("franc");
const iso_639_3_1 = require("iso-639-3");
// Lazy load WinkNLP to avoid initialization errors in Node.js
let winkNLP = null;
let winkModel = null;
let winkInitialized = false;
/**
 * A collection of constants used across the extension.
 * @class EXTENSION_CONSTANTS
 * @static
 * @readonly
 * @summary Holds constant values for the extension.
 */
class EXTENSION_CONSTANTS {
}
// The full list should be loaded dynamically via LexiconLoader.
EXTENSION_CONSTANTS._stopwords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "if",
    "because",
    "as",
    "what",
    "which",
    "this",
    "that",
    "these",
    "those",
    "then",
    "just",
    "so",
    "than",
    "such",
    "when",
    "while",
    "to",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "here",
    "there",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "very",
    "can",
    "will",
    "is",
    "are",
    "was",
    "were",
]);
/**
 * @class LexiconLoader
 * @summary Service to handle asynchronous loading of linguistic data (IDF, Stopwords)
 * @description Loads and caches lexicons for stopword filtering and IDF weighting.
 * Note: Sentiment lexicons are now handled internally by the 'natural' and 'wink-nlp' libraries.
 */
class LexiconLoader {
    /**
     * @function loadStandardIDF
     * @summary Fetches a standard English IDF map for Keyword Extraction (TF-IDF)
     * @description Implements "Dynamic IDF Loading" using a rank-based approximation from a frequency list.
     */
    static async loadStandardIDF() {
        if (this.idfCache)
            return this.idfCache;
        try {
            const response = await fetch(this.IDF_URL);
            if (!response.ok)
                throw new Error("Failed to fetch IDF source");
            const text = await response.text();
            const map = new Map();
            const lines = text.split(/\r?\n/);
            lines.forEach((line, index) => {
                const word = line.trim().toLowerCase();
                if (word) {
                    // Zipf's Law Approximation: IDF ≈ log(Rank)
                    map.set(word, Math.log(index + 1));
                }
            });
            this.idfCache = map;
            return map;
        }
        catch (error) {
            console.warn("Failed to load IDF map", error);
            return new Map();
        }
    }
    /**
     * @function loadStopWords
     * @summary Fetches and merges Stopwords lists from multiple URLs
     */
    static async loadStopWords() {
        if (this.stopWordsCache)
            return this.stopWordsCache;
        try {
            const fetchPromises = this.STOPWORD_URLS.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok)
                        return [];
                    const words = await response.json();
                    return Array.isArray(words) ? words : [];
                }
                catch (err) {
                    return [];
                }
            });
            const results = await Promise.all(fetchPromises);
            const mergedWords = results.flat();
            this.stopWordsCache = new Set(mergedWords.length > 0 ? mergedWords : EXTENSION_CONSTANTS._stopwords);
            return this.stopWordsCache;
        }
        catch (error) {
            return EXTENSION_CONSTANTS._stopwords;
        }
    }
}
exports.LexiconLoader = LexiconLoader;
LexiconLoader.stopWordsCache = null;
LexiconLoader.idfCache = null;
// URL for General English IDF (Inverse Document Frequency)
// Using Google's 10k most common English words list (sorted by frequency)
LexiconLoader.IDF_URL = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt";
LexiconLoader.STOPWORD_URLS = [
    "https://raw.githubusercontent.com/6/stopwords-json/master/dist/en.json",
    "https://raw.githubusercontent.com/stopwords-iso/stopwords-en/master/stopwords-en.json",
    "https://raw.githubusercontent.com/Alir3z4/stop-words/master/english.txt",
];
/**
 * Helper function to safely initialize WinkNLP
 */
async function initializeWinkNLP() {
    if (winkInitialized)
        return !!winkNLP;
    try {
        // Only initialize in browser environments or when explicitly enabled
        const isBrowser = typeof window !== "undefined";
        const isEnabled = process.env.ENABLE_WINK === "true";
        if (isBrowser || isEnabled) {
            const winkNLPModule = await Promise.resolve().then(() => __importStar(require("wink-nlp")));
            const modelModule = await Promise.resolve().then(() => __importStar(require("wink-eng-lite-web-model")));
            winkNLP = winkNLPModule.default;
            winkModel = modelModule.default;
            winkInitialized = true;
            return true;
        }
    }
    catch (error) {
        console.warn("WinkNLP initialization skipped (optional):", error instanceof Error ? error.message : String(error));
    }
    winkInitialized = true;
    return false;
}
/**
 * @class SentimentAnalyzer
 * @summary Ensemble Sentiment Analysis using Natural, Wink-NLP, and Compromise
 * @description Combines scores from three different NLP libraries to provide a robust sentiment score.
 * - Natural: AFINN-based vocabulary scoring.
 * - Wink-NLP: Specialized sentiment model (optional, gracefully degraded).
 * - Compromise: Pattern matching for positive/negative adjectives.
 */
class SentimentAnalyzer {
    constructor() {
        this.winkDoc = null;
        this.winkAvailable = false;
        // 1. Initialize Natural (uses AFINN lexicon and Porter Stemmer)
        const stemmer = natural_1.default.PorterStemmer;
        this.naturalAnalyzer = new natural_1.default.SentimentAnalyzer("English", stemmer, "afinn");
        this.naturalTokenizer = new natural_1.default.WordTokenizer();
        // 2. Initialize WinkNLP asynchronously (don't block constructor)
        this.initWink();
    }
    async initWink() {
        try {
            this.winkAvailable = await initializeWinkNLP();
            if (this.winkAvailable && winkNLP && winkModel) {
                this.winkDoc = winkNLP(winkModel);
            }
        }
        catch (error) {
            console.warn("WinkNLP not available, using Natural + Compromise only");
            this.winkAvailable = false;
        }
    }
    /**
     * @function analyze
     * @summary Computes an ensemble sentiment score
     * @param {string} text - The text to analyze
     */
    analyze(text) {
        if (!text || typeof text !== "string")
            throw new Error("Input must be a non-empty string");
        // --- Method 1: Natural ---
        const tokens = this.naturalTokenizer.tokenize(text);
        // Natural returns average polarity (e.g., -5 to 5). We clamp it roughly to -1 to 1 for consistency.
        let naturalScore = this.naturalAnalyzer.getSentiment(tokens);
        // Normalize natural score (AFINN avg is rarely > 3 or < -3 in normal text)
        naturalScore = Math.max(-1, Math.min(1, naturalScore / 3));
        // --- Method 2: Wink-NLP (if available) ---
        let winkScore = 0;
        if (this.winkAvailable && this.winkDoc) {
            try {
                const doc = this.winkDoc.readDoc(text);
                winkScore = doc.out(this.winkDoc.its.sentiment); // Returns -1 to 1
            }
            catch (error) {
                console.warn("WinkNLP analysis failed, using fallback");
                winkScore = 0;
            }
        }
        // --- Method 3: Compromise (Heuristic Fallback) ---
        // Counts #Positive vs #Negative tags if libraries return neutral/zero
        const cDoc = (0, compromise_1.default)(text);
        const positiveCount = cDoc.match("#Positive").length;
        const negativeCount = cDoc.match("#Negative").length;
        let compromiseScore = 0;
        if (positiveCount + negativeCount > 0) {
            compromiseScore =
                (positiveCount - negativeCount) / (positiveCount + negativeCount);
        }
        // --- Ensemble Voting ---
        // Adjust weights based on WinkNLP availability
        let weightedScore;
        if (this.winkAvailable && this.winkDoc) {
            // Full ensemble with WinkNLP
            weightedScore =
                naturalScore * 0.4 + winkScore * 0.4 + compromiseScore * 0.2;
        }
        else {
            // Fallback: Natural + Compromise only
            weightedScore = naturalScore * 0.6 + compromiseScore * 0.4;
        }
        return {
            score: weightedScore,
            positiveWordCount: positiveCount,
            negativeWordCount: negativeCount,
            totalWords: tokens.length,
            classification: this.classifySentiment(weightedScore),
        };
    }
    classifySentiment(score) {
        if (score >= 0.1)
            return "positive";
        if (score <= -0.1)
            return "negative";
        return "neutral";
    }
    /**
     * @function addCustomLexicon
     * @summary Adds custom positive/negative words to the sentiment analysis
     * @param lexicon
     * @deprecated Use library training methods instead.
     */
    addCustomLexicon(lexicon) {
        console.warn("addCustomLexicon is deprecated in the Ensemble Analyzer. Use library training methods instead.");
    }
}
exports.SentimentAnalyzer = SentimentAnalyzer;
/**
 * @class KeywordExtractor
 * @summary Extracts keywords using TF-IDF logic
 * @description Enhanced to use Inverse Document Frequency (IDF) if available,
 * implementing the "Semantic Analysis" requirements of the design doc.
 */
class KeywordExtractor {
    constructor() {
        this.stopWords =
            LexiconLoader.stopWordsCache || EXTENSION_CONSTANTS._stopwords;
        this.idfMap = LexiconLoader.idfCache || new Map();
    }
    extractKeywords(text, topN = 5) {
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        if (words.length === 0)
            return [];
        // 1. Calculate Term Frequency (TF)
        const tf = {};
        const totalWords = words.length;
        words.forEach((word) => {
            if (!this.stopWords.has(word) && word.length > 2) {
                // Normalized TF: (count / total_words)
                tf[word] = (tf[word] || 0) + 1;
            }
        });
        // 2. Calculate TF-IDF Score
        const scores = {};
        Object.keys(tf).forEach((word) => {
            const normalizedTF = tf[word] / totalWords;
            // Default IDF is 1.0 if not found in map (assumes somewhat rare if not a stopword)
            // In a full implementation, we would punish unknown words or have a "default IDF" for the corpus
            const idf = this.idfMap.get(word) || 1.5;
            scores[word] = normalizedTF * idf;
        });
        return Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .slice(0, topN)
            .map(([word]) => word);
    }
}
exports.KeywordExtractor = KeywordExtractor;
/**
 * @class TextStatistics
 * @summary Readability Metrics (Flesch-Kincaid & SMOG) with enhanced short text handling
 */
class TextStatistics {
    fleschKincaidReadability(text) {
        if (!text)
            throw new Error("Input must be a non-empty string");
        const words = text.match(/\b\w+\b/g) || [];
        const wordCount = words.length;
        // Handle empty text after word extraction
        if (wordCount === 0)
            return this.getEmptyResult();
        // Enhanced sentence detection - handles incomplete sentences
        const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [];
        const sentenceCount = sentences.length > 0 ? sentences.length : 1;
        const syllables = this.countSyllablesInText(words);
        const avgWordsPerSentence = wordCount / sentenceCount;
        const avgSyllablesPerWord = syllables / wordCount;
        // Flesch Reading Ease (bounded between 0-100)
        const readingEase = Math.max(0, Math.min(100, 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord));
        // Flesch-Kincaid Grade Level (minimum grade 0)
        const gradeLevel = Math.max(0, 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59);
        // SMOG Index with handling for very short texts
        // SMOG requires at least 30 sentences ideally, but we adapt for shorter texts
        const polySyllables = words.filter((w) => this.countSyllables(w) >= 3).length;
        let smogIndex;
        if (sentenceCount < 3 || wordCount < 10) {
            // For very short texts, use a simplified approximation based on polysyllable density
            const polySyllableRatio = wordCount > 0 ? polySyllables / wordCount : 0;
            smogIndex = Math.max(0, 3.1291 + polySyllableRatio * 10);
        }
        else {
            // Standard SMOG formula
            smogIndex =
                1.043 * Math.sqrt(polySyllables * (30 / sentenceCount)) + 3.1291;
        }
        return {
            readabilityScore: Number(readingEase.toFixed(1)),
            gradeLevel: Number(gradeLevel.toFixed(1)),
            smogIndex: Number(smogIndex.toFixed(1)),
            wordCount,
            sentenceCount,
            syllableCount: syllables,
            avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(1)),
            avgSyllablesPerWord: Number(avgSyllablesPerWord.toFixed(2)),
            complexity: this.getComplexityLabel(readingEase),
        };
    }
    countSyllables(word) {
        if (!word)
            return 0;
        word = word.toLowerCase().trim();
        if (word.length <= 3)
            return 1;
        // Remove silent e
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
        // Count vowel groups
        const syllableMatch = word.match(/[aeiouy]{1,2}/g);
        return syllableMatch ? syllableMatch.length : 1;
    }
    countSyllablesInText(words) {
        return words.reduce((total, word) => total + this.countSyllables(word), 0);
    }
    getComplexityLabel(readingEase) {
        if (readingEase >= 90)
            return "Very Easy";
        if (readingEase >= 80)
            return "Easy";
        if (readingEase >= 70)
            return "Fairly Easy";
        if (readingEase >= 60)
            return "Standard";
        if (readingEase >= 50)
            return "Fairly Difficult";
        if (readingEase >= 30)
            return "Difficult";
        return "Very Difficult";
    }
    getEmptyResult() {
        return {
            readabilityScore: 0,
            gradeLevel: 0,
            smogIndex: 0,
            wordCount: 0,
            sentenceCount: 0,
            syllableCount: 0,
            avgWordsPerSentence: 0,
            avgSyllablesPerWord: 0,
            complexity: "N/A",
        };
    }
}
exports.TextStatistics = TextStatistics;
/**
 * @class LanguageDetector
 * @summary Language detection using franc library with ISO 639-3 support
 * @description Uses franc for accurate language detection across 186 languages.
 * Returns ISO 639-3 codes with confidence scores and language names.
 */
class LanguageDetector {
    constructor(minTextLength = 10) {
        this.minTextLength = 10;
        this.minTextLength = minTextLength;
    }
    /**
     * @function detect
     * @summary Detects the language of the provided text
     * @param {string} text - The text to analyze
     * @param {Object} options - Detection options
     * @param {string[]} options.whitelist - Languages to consider (ISO 639-3 codes)
     * @param {string[]} options.blacklist - Languages to ignore (ISO 639-3 codes)
     * @param {number} options.minLength - Minimum text length for detection
     * @returns {LanguageDetectionResult} Detection result with language, confidence, and scores
     */
    detect(text, options) {
        if (!text || typeof text !== "string") {
            throw new Error("Input must be a non-empty string");
        }
        const minLength = options?.minLength ?? this.minTextLength;
        // If text is too short, return uncertain result
        if (text.length < minLength) {
            return {
                detectedLanguage: "und",
                languageName: "Undetermined",
                confidence: 0,
                scores: { und: 0 },
                alternativeLanguages: [],
            };
        }
        // Prepare franc options
        const francOptions = {
            minLength,
        };
        if (options?.whitelist && options.whitelist.length > 0) {
            francOptions.whitelist = options.whitelist;
        }
        if (options?.blacklist && options.blacklist.length > 0) {
            francOptions.blacklist = options.blacklist;
        }
        // Get all possible language matches with scores
        const allResults = (0, franc_1.francAll)(text, francOptions);
        if (!allResults || allResults.length === 0 || allResults[0][0] === "und") {
            return {
                detectedLanguage: "und",
                languageName: "Undetermined",
                confidence: 0,
                scores: { und: 0 },
                alternativeLanguages: [],
            };
        }
        // Get the top result
        const [topLangCode, topScore] = allResults[0];
        // Get language name from ISO 639-3
        const languageName = this.getLanguageName(topLangCode);
        // Calculate confidence (franc returns 0-1, we convert to 0-100 percentage)
        const confidence = Number((topScore * 100).toFixed(2));
        // Build scores object
        const scores = {};
        allResults.slice(0, 5).forEach(([code, score]) => {
            scores[code] = Number((score * 100).toFixed(2));
        });
        // Get alternative languages (top 3 after the primary)
        const alternativeLanguages = allResults
            .slice(1, 4)
            .map(([code, score]) => ({
            language: code,
            languageName: this.getLanguageName(code),
            confidence: Number((score * 100).toFixed(2)),
        }));
        return {
            detectedLanguage: topLangCode,
            languageName,
            confidence,
            scores,
            alternativeLanguages,
        };
    }
    /**
     * @private
     * @function getLanguageName
     * @summary Gets the human-readable language name from ISO 639-3 code
     * @param {string} code - ISO 639-3 language code
     * @returns {string} Language name or code if not found
     */
    getLanguageName(code) {
        // Special handling for common codes
        const commonNames = {
            und: "Undetermined",
            eng: "English",
            spa: "Spanish",
            fra: "French",
            deu: "German",
            ita: "Italian",
            por: "Portuguese",
            rus: "Russian",
            jpn: "Japanese",
            kor: "Korean",
            cmn: "Chinese (Mandarin)",
            arb: "Arabic",
            hin: "Hindi",
            ben: "Bengali",
            nld: "Dutch",
            pol: "Polish",
            tur: "Turkish",
            vie: "Vietnamese",
            tha: "Thai",
            swe: "Swedish",
        };
        if (commonNames[code]) {
            return commonNames[code];
        }
        // Try to find in ISO 639-3 database
        try {
            const language = iso_639_3_1.iso6393.find((lang) => lang.iso6393 === code);
            if (language && language.name) {
                return language.name;
            }
        }
        catch (error) {
            console.warn(`Could not find language name for code: ${code}`);
        }
        // Return the code itself if name not found
        return code.toUpperCase();
    }
    /**
     * @function addCustomLanguage
     * @summary Placeholder for custom language profiles
     * @description Franc doesn't support custom language profiles.
     * This method is provided for API compatibility but logs a warning.
     */
    addCustomLanguage(lang, profile) {
        console.warn("Custom language profiles are not supported by franc. " +
            "Use whitelist/blacklist options in detect() instead.");
    }
}
exports.LanguageDetector = LanguageDetector;
/**
 * @class TextDiff
 * @summary Utility for text comparison
 */
class TextDiff {
    compare(text1, text2) {
        const words1 = text1.split(/\s+/).filter((w) => w.length > 0);
        const words2 = text2.split(/\s+/).filter((w) => w.length > 0);
        const added = [];
        const removed = [];
        const unchanged = [];
        const countWords = (words) => {
            const counts = new Map();
            words.forEach((w) => counts.set(w, (counts.get(w) || 0) + 1));
            return counts;
        };
        const counts1 = countWords(words1);
        const counts2 = countWords(words2);
        const allWords = new Set([...counts1.keys(), ...counts2.keys()]);
        allWords.forEach((word) => {
            const c1 = counts1.get(word) || 0;
            const c2 = counts2.get(word) || 0;
            const min = Math.min(c1, c2);
            for (let i = 0; i < min; i++)
                unchanged.push(word);
            if (c2 > c1) {
                for (let i = 0; i < c2 - c1; i++)
                    added.push(word);
            }
            else if (c1 > c2) {
                for (let i = 0; i < c1 - c2; i++)
                    removed.push(word);
            }
        });
        const matches = unchanged.length;
        const similarity = ((2.0 * matches) / (words1.length + words2.length)) * 100 || 0;
        return {
            similarity,
            editDistance: 0,
            commonSubstrings: [],
            wordDifference: {
                added,
                removed,
                unchanged,
                addedCount: added.length,
                removedCount: removed.length,
                unchangedCount: unchanged.length,
            },
        };
    }
}
exports.TextDiff = TextDiff;
