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
 * @summary Naive n-gram detector (Placeholder for future dynamic expansion)
 */
export declare class LanguageDetector {
    private languageProfiles;
    constructor();
    private initializeLanguageProfiles;
    detect(text: string): LanguageDetectionResult;
    addCustomLanguage(lang: string, profile: Record<string, number>): void;
}
export interface LanguageDetectionResult {
    detectedLanguage: string;
    confidence: number;
    scores: Record<string, number>;
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
