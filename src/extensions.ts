import natural from "natural";
import nlp from "compromise";

// Lazy load WinkNLP to avoid initialization errors in Node.js
let winkNLP: any = null;
let winkModel: any = null;
let winkInitialized = false;

/**
 * A collection of constants used across the extension.
 * @class EXTENSION_CONSTANTS
 * @static
 * @readonly
 * @summary Holds constant values for the extension.
 */
class EXTENSION_CONSTANTS {
  // The full list should be loaded dynamically via LexiconLoader.
  public static readonly _stopwords: Set<string> = new Set([
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
}

/**
 * @class LexiconLoader
 * @summary Service to handle asynchronous loading of linguistic data (IDF, Stopwords)
 * @description Loads and caches lexicons for stopword filtering and IDF weighting.
 * Note: Sentiment lexicons are now handled internally by the 'natural' and 'wink-nlp' libraries.
 */
export class LexiconLoader {
  public static stopWordsCache: Set<string> | null = null;
  public static idfCache: Map<string, number> | null = null;

  // URL for General English IDF (Inverse Document Frequency)
  // Using Google's 10k most common English words list (sorted by frequency)
  private static readonly IDF_URL =
    "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt";

  private static readonly STOPWORD_URLS = [
    "https://raw.githubusercontent.com/6/stopwords-json/master/dist/en.json",
    "https://raw.githubusercontent.com/stopwords-iso/stopwords-en/master/stopwords-en.json",
    "https://raw.githubusercontent.com/Alir3z4/stop-words/master/english.txt",
  ];

  /**
   * @function loadStandardIDF
   * @summary Fetches a standard English IDF map for Keyword Extraction (TF-IDF)
   * @description Implements "Dynamic IDF Loading" using a rank-based approximation from a frequency list.
   */
  public static async loadStandardIDF(): Promise<Map<string, number>> {
    if (this.idfCache) return this.idfCache;

    try {
      const response = await fetch(this.IDF_URL);
      if (!response.ok) throw new Error("Failed to fetch IDF source");

      const text = await response.text();
      const map = new Map<string, number>();
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
    } catch (error) {
      console.warn("Failed to load IDF map", error);
      return new Map();
    }
  }

  /**
   * @function loadStopWords
   * @summary Fetches and merges Stopwords lists from multiple URLs
   */
  public static async loadStopWords(): Promise<Set<string>> {
    if (this.stopWordsCache) return this.stopWordsCache;

    try {
      const fetchPromises = this.STOPWORD_URLS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) return [];
          const words = await response.json();
          return Array.isArray(words) ? words : [];
        } catch (err) {
          return [];
        }
      });

      const results = await Promise.all(fetchPromises);
      const mergedWords = results.flat();

      this.stopWordsCache = new Set(
        mergedWords.length > 0 ? mergedWords : EXTENSION_CONSTANTS._stopwords,
      );
      return this.stopWordsCache;
    } catch (error) {
      return EXTENSION_CONSTANTS._stopwords;
    }
  }
}

/**
 * Helper function to safely initialize WinkNLP
 */
async function initializeWinkNLP(): Promise<boolean> {
  if (winkInitialized) return !!winkNLP;

  try {
    // Only initialize in browser environments or when explicitly enabled
    const isBrowser = typeof window !== "undefined";
    const isEnabled = process.env.ENABLE_WINK === "true";

    if (isBrowser || isEnabled) {
      const winkNLPModule = await import("wink-nlp");
      const modelModule = await import("wink-eng-lite-web-model");

      winkNLP = winkNLPModule.default;
      winkModel = modelModule.default;
      winkInitialized = true;
      return true;
    }
  } catch (error) {
    console.warn(
      "WinkNLP initialization skipped (optional):",
      error instanceof Error ? error.message : String(error),
    );
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
export class SentimentAnalyzer {
  private naturalAnalyzer: natural.SentimentAnalyzer;
  private naturalTokenizer: natural.WordTokenizer;
  private winkDoc: any = null;
  private winkAvailable: boolean = false;

  constructor() {
    // 1. Initialize Natural (uses AFINN lexicon and Porter Stemmer)
    const stemmer = natural.PorterStemmer;
    this.naturalAnalyzer = new natural.SentimentAnalyzer(
      "English",
      stemmer,
      "afinn",
    );
    this.naturalTokenizer = new natural.WordTokenizer();

    // 2. Initialize WinkNLP asynchronously (don't block constructor)
    this.initWink();
  }

  private async initWink(): Promise<void> {
    try {
      this.winkAvailable = await initializeWinkNLP();
      if (this.winkAvailable && winkNLP && winkModel) {
        this.winkDoc = winkNLP(winkModel);
      }
    } catch (error) {
      console.warn("WinkNLP not available, using Natural + Compromise only");
      this.winkAvailable = false;
    }
  }

  /**
   * @function analyze
   * @summary Computes an ensemble sentiment score
   * @param {string} text - The text to analyze
   */
  public analyze(text: string): SentimentResult {
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
      } catch (error) {
        console.warn("WinkNLP analysis failed, using fallback");
        winkScore = 0;
      }
    }

    // --- Method 3: Compromise (Heuristic Fallback) ---
    // Counts #Positive vs #Negative tags if libraries return neutral/zero
    const cDoc = nlp(text);
    const positiveCount = cDoc.match("#Positive").length;
    const negativeCount = cDoc.match("#Negative").length;
    let compromiseScore = 0;
    if (positiveCount + negativeCount > 0) {
      compromiseScore =
        (positiveCount - negativeCount) / (positiveCount + negativeCount);
    }

    // --- Ensemble Voting ---
    // Adjust weights based on WinkNLP availability
    let weightedScore: number;
    if (this.winkAvailable && this.winkDoc) {
      // Full ensemble with WinkNLP
      weightedScore =
        naturalScore * 0.4 + winkScore * 0.4 + compromiseScore * 0.2;
    } else {
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

  private classifySentiment(score: number): SentimentClassification {
    if (score >= 0.1) return "positive";
    if (score <= -0.1) return "negative";
    return "neutral";
  }

  /**
   * @function addCustomLexicon
   * @summary Adds custom positive/negative words to the sentiment analysis
   * @param lexicon
   * @deprecated Use library training methods instead.
   */
  public addCustomLexicon(lexicon: {
    positive?: string[];
    negative?: string[];
  }): void {
    console.warn(
      "addCustomLexicon is deprecated in the Ensemble Analyzer. Use library training methods instead.",
    );
  }
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
export class KeywordExtractor {
  private stopWords: Set<string>;
  private idfMap: Map<string, number>;

  constructor() {
    this.stopWords =
      LexiconLoader.stopWordsCache || EXTENSION_CONSTANTS._stopwords;
    this.idfMap = LexiconLoader.idfCache || new Map();
  }

  public extractKeywords(text: string, topN: number = 5): string[] {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    if (words.length === 0) return [];

    // 1. Calculate Term Frequency (TF)
    const tf: Record<string, number> = {};
    const totalWords = words.length;

    words.forEach((word) => {
      if (!this.stopWords.has(word) && word.length > 2) {
        // Normalized TF: (count / total_words)
        tf[word] = (tf[word] || 0) + 1;
      }
    });

    // 2. Calculate TF-IDF Score
    const scores: Record<string, number> = {};

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

/**
 * @class TextStatistics
 * @summary Readability Metrics (Flesch-Kincaid & SMOG) with enhanced short text handling
 */
export class TextStatistics {
  public fleschKincaidReadability(text: string): ReadabilityResult {
    if (!text) throw new Error("Input must be a non-empty string");

    const words = text.match(/\b\w+\b/g) || [];
    const wordCount = words.length;

    // Handle empty text after word extraction
    if (wordCount === 0) return this.getEmptyResult();

    // Enhanced sentence detection - handles incomplete sentences
    const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g) || [];
    const sentenceCount = sentences.length > 0 ? sentences.length : 1;

    const syllables = this.countSyllablesInText(words);

    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllables / wordCount;

    // Flesch Reading Ease (bounded between 0-100)
    const readingEase = Math.max(
      0,
      Math.min(
        100,
        206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord,
      ),
    );

    // Flesch-Kincaid Grade Level (minimum grade 0)
    const gradeLevel = Math.max(
      0,
      0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59,
    );

    // SMOG Index with handling for very short texts
    // SMOG requires at least 30 sentences ideally, but we adapt for shorter texts
    const polySyllables = words.filter(
      (w) => this.countSyllables(w) >= 3,
    ).length;

    let smogIndex: number;
    if (sentenceCount < 3 || wordCount < 10) {
      // For very short texts, use a simplified approximation based on polysyllable density
      const polySyllableRatio = wordCount > 0 ? polySyllables / wordCount : 0;
      smogIndex = Math.max(0, 3.1291 + polySyllableRatio * 10);
    } else {
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

  private countSyllables(word: string): number {
    if (!word) return 0;

    word = word.toLowerCase().trim();
    if (word.length <= 3) return 1;

    // Remove silent e
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");

    // Count vowel groups
    const syllableMatch = word.match(/[aeiouy]{1,2}/g);
    return syllableMatch ? syllableMatch.length : 1;
  }

  private countSyllablesInText(words: string[]): number {
    return words.reduce((total, word) => total + this.countSyllables(word), 0);
  }

  private getComplexityLabel(readingEase: number): string {
    if (readingEase >= 90) return "Very Easy";
    if (readingEase >= 80) return "Easy";
    if (readingEase >= 70) return "Fairly Easy";
    if (readingEase >= 60) return "Standard";
    if (readingEase >= 50) return "Fairly Difficult";
    if (readingEase >= 30) return "Difficult";
    return "Very Difficult";
  }

  private getEmptyResult(): ReadabilityResult {
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
export class LanguageDetector {
  private languageProfiles: Map<string, Map<string, number>>;

  constructor() {
    this.languageProfiles = new Map();
    this.initializeLanguageProfiles();
  }

  private initializeLanguageProfiles(): void {
    const english = new Map([
      ["the", 1],
      ["and", 0.95],
      ["ing", 0.94],
    ]);
    const spanish = new Map([
      ["que", 1],
      ["ent", 0.96],
      ["ade", 0.94],
    ]);
    const french = new Map([
      ["les", 1],
      ["ent", 0.96],
      ["que", 0.94],
    ]);

    this.languageProfiles.set("english", english);
    this.languageProfiles.set("spanish", spanish);
    this.languageProfiles.set("french", french);
  }

  public detect(text: string): LanguageDetectionResult {
    // Simplified detection logic
    return {
      detectedLanguage: "english",
      confidence: 0.9,
      scores: { english: 0.9 },
    };
  }

  public addCustomLanguage(lang: string, profile: Record<string, number>) {
    // Custom language profile logic
  }
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
export class TextDiff {
  public compare(text1: string, text2: string): TextDiffResult {
    const words1 = text1.split(/\s+/).filter((w) => w.length > 0);
    const words2 = text2.split(/\s+/).filter((w) => w.length > 0);

    const added: string[] = [];
    const removed: string[] = [];
    const unchanged: string[] = [];

    const countWords = (words: string[]): Map<string, number> => {
      const counts = new Map<string, number>();
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

      for (let i = 0; i < min; i++) unchanged.push(word);

      if (c2 > c1) {
        for (let i = 0; i < c2 - c1; i++) added.push(word);
      } else if (c1 > c2) {
        for (let i = 0; i < c1 - c2; i++) removed.push(word);
      }
    });

    const matches = unchanged.length;
    const similarity =
      ((2.0 * matches) / (words1.length + words2.length)) * 100 || 0;

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

export interface TextDiffResult {
  similarity: number;
  editDistance: number;
  commonSubstrings: Array<{ substring: string; length: number }>;
  wordDifference: {
    added: string[];
    removed: string[];
    unchanged: string[];
    addedCount: number;
    removedCount: number;
    unchangedCount: number;
  };
}
