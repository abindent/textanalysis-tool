/**
 * @class LexiconLoader
 * @summary Service to handle asynchronous loading of linguistic data (IDF, Stopwords)
 * @description Loads and caches lexicons for stopword filtering and IDF weighting.
 * Note: Sentiment lexicons are now handled internally by the 'natural' and 'wink-nlp' libraries.
 */
export declare class LexiconLoader {
    static stopWordsCache: Set<string> | null;
    static idfCache: Map<string, number> | null;
    private static readonly IDF_URL;
    private static readonly STOPWORD_URLS;
    /**
     * @function loadStandardIDF
     * @summary Fetches a standard English IDF map for Keyword Extraction (TF-IDF)
     * @description Implements "Dynamic IDF Loading" using a rank-based approximation from a frequency list.
     */
    static loadStandardIDF(): Promise<Map<string, number>>;
    /**
     * @function loadStopWords
     * @summary Fetches and merges Stopwords lists from multiple URLs
     */
    static loadStopWords(): Promise<Set<string>>;
}
/**
 * @class SentimentAnalyzer
 * @summary Ensemble Sentiment Analysis using Natural, Wink-NLP, and Compromise
 * @description Combines scores from three different NLP libraries to provide a robust sentiment score.
 * - Natural: AFINN-based vocabulary scoring.
 * - Wink-NLP: Specialized sentiment model (optional, gracefully degraded).
 * - Compromise: Pattern matching for positive/negative adjectives.
 */
export declare class SentimentAnalyzer {
    private naturalAnalyzer;
    private naturalTokenizer;
    private winkDoc;
    private winkAvailable;
    constructor();
    private initWink;
    /**
     * @function analyze
     * @summary Computes an ensemble sentiment score
     * @param {string} text - The text to analyze
     */
    analyze(text: string): SentimentResult;
    private classifySentiment;
    /**
     * @function addCustomLexicon
     * @summary Adds custom positive/negative words to the sentiment analysis
     * @param lexicon
     * @deprecated Use library training methods instead.
     */
    addCustomLexicon(lexicon: {
        positive?: string[];
        negative?: string[];
    }): void;
}
export interface SentimentResult {
    score: number;
    positiveWordCount: number;
    negativeWordCount: number;
    totalWords: number;
    classification: SentimentClassification;
}
export type SentimentClassification = "positive" | "negative" | "neutral";
/**
 * @class KeywordExtractor
 * @summary Extracts keywords using TF-IDF logic
 * @description Enhanced to use Inverse Document Frequency (IDF) if available,
 * implementing the "Semantic Analysis" requirements of the design doc.
 */
export declare class KeywordExtractor {
    private stopWords;
    private idfMap;
    constructor();
    extractKeywords(text: string, topN?: number): string[];
}
/**
 * @class TextStatistics
 * @summary Readability Metrics (Flesch-Kincaid & SMOG) with enhanced short text handling
 */
export declare class TextStatistics {
    fleschKincaidReadability(text: string): ReadabilityResult;
    private countSyllables;
    private countSyllablesInText;
    private getComplexityLabel;
    private getEmptyResult;
}
export interface ReadabilityResult {
    readabilityScore: number;
    gradeLevel: number;
    smogIndex: number;
    wordCount: number;
    sentenceCount: number;
    syllableCount: number;
    avgWordsPerSentence: number;
    avgSyllablesPerWord: number;
    complexity: string;
}
/**
 * @class LanguageDetector
 * @summary Language detection using franc library with ISO 639-3 support
 * @description Uses franc for accurate language detection across 186 languages.
 * Returns ISO 639-3 codes with confidence scores and language names.
 */
export declare class LanguageDetector {
    private minTextLength;
    constructor(minTextLength?: number);
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
    detect(text: string, options?: {
        whitelist?: string[];
        blacklist?: string[];
        minLength?: number;
    }): LanguageDetectionResult;
    /**
     * @private
     * @function getLanguageName
     * @summary Gets the human-readable language name from ISO 639-3 code
     * @param {string} code - ISO 639-3 language code
     * @returns {string} Language name or code if not found
     */
    private getLanguageName;
    /**
     * @function addCustomLanguage
     * @summary Placeholder for custom language profiles
     * @description Franc doesn't support custom language profiles.
     * This method is provided for API compatibility but logs a warning.
     */
    addCustomLanguage(lang: string, profile: Record<string, number>): void;
}
export interface LanguageDetectionResult {
    detectedLanguage: string;
    languageName: string;
    confidence: number;
    scores: Record<string, number>;
    alternativeLanguages: Array<{
        language: string;
        languageName: string;
        confidence: number;
    }>;
}
/**
 * @class TextDiff
 * @summary Utility for text comparison
 */
export declare class TextDiff {
    compare(text1: string, text2: string): TextDiffResult;
}
export interface TextDiffResult {
    similarity: number;
    editDistance: number;
    commonSubstrings: Array<{
        substring: string;
        length: number;
    }>;
    wordDifference: {
        added: string[];
        removed: string[];
        unchanged: string[];
        addedCount: number;
        removedCount: number;
        unchangedCount: number;
    };
}
