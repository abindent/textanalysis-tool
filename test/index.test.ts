/**
 * @file index.test.ts
 * @description Comprehensive test suite for text analysis tools
 * @author Sinchan Maitra
 */


// ============================================================================
// IMPORTS
// ============================================================================

import { Analyser, Operations } from "../src";

// ============================================================================
// TEST SETUP
// ============================================================================

/**
 * Mock global fetch for network resource loading
 * Prevents actual HTTP requests during testing
 */
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve(
        "the\nand\nis\na\nof\ngood\nbad\nhappy\nsad\nexcellent\nterrible\nwonderful\nawful"
      ),
      json: () => Promise.resolve([
        "the", "and", "is", "a", "an", "of", "to", "in", "for", "on"
      ]),
    }),
  ) as jest.Mock;
});

/**
 * Cleanup after all tests
 */
afterAll(() => {
  jest.restoreAllMocks();
});

// ============================================================================
// TEST SUITES
// ============================================================================

describe("Text Analysis Tools", () => {
  /**
   * Sample text used across multiple tests
   */
  const sampleText =
    "Hello World! This is a test string with 123 numbers, https://example.com URL, test@email.com, #hashtag, and @mention. It has multiple sentences too. The movie was good.";

  // ==========================================================================
  // BASIC FUNCTIONALITY TESTS
  // ==========================================================================
  
  describe("Basic Functionality", () => {
    it("should initialize with provided text using the factory method", async () => {
      const analyser = await Analyser.create(sampleText);
      expect(analyser.raw_text).toBe(sampleText);
    });

    it("should throw error for non-string input", async () => {
      await expect(Analyser.create(123 as any)).rejects.toThrow(
        "Input text must be a string",
      );
    });
  });

  // ==========================================================================
  // COUNTING OPERATIONS TESTS
  // ==========================================================================
  
  describe("Counting Operations", () => {
    it("should count characters correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.CountCharacters]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.characterCount).toBeGreaterThan(0);
      expect(typeof result.metadata.counts.characterCount).toBe('number');
    });

    it("should count alphabets correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.CountAlphabets]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.alphabetCount).toBeGreaterThan(0);
      expect(typeof result.metadata.counts.alphabetCount).toBe('number');
    });

    it("should count numbers correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.CountNumbers]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.numericCount).toBe(3); // "123" = 3 digits
    });

    it("should count words correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.CountWords]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.wordCount).toBeGreaterThan(0);
    });

    it("should count sentences correctly", async () => {
      const simpleSentenceText =
        "This is the first sentence. This is the second sentence.";
      const analyser = await Analyser.create(simpleSentenceText, {
        [Operations.CountSentences]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.sentenceCount).toBe(2);
    });
  });

  // ==========================================================================
  // EXTRACTION OPERATIONS TESTS
  // ==========================================================================
  
  describe("Extraction Operations", () => {
    it("should extract URLs correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ExtractUrls]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.urls).toContain("https://example.com");
      expect(Array.isArray(result.metadata.urls)).toBe(true);
    });

    it("should extract emails correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ExtractEmails]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.emails).toContain("test@email.com");
      expect(Array.isArray(result.metadata.emails)).toBe(true);
    });

    it("should extract hashtags correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ExtractHashtags]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.hashtags).toContain("#hashtag");
      expect(Array.isArray(result.metadata.hashtags)).toBe(true);
    });

    it("should extract mentions correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ExtractMentions]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.mentions).toContain("@mention");
      expect(Array.isArray(result.metadata.mentions)).toBe(true);
    });

    it("should extract keywords using TF-IDF correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ExtractKeywords]: { topN: 3 },
      });

      const result = await analyser.main();
      expect(result.metadata.keywords).toBeDefined();
      expect(Array.isArray(result.metadata.keywords)).toBe(true);
      expect(result.metadata.keywords?.length).toBeLessThanOrEqual(3);
    });
  });

  // ==========================================================================
  // TEXT TRANSFORMATION TESTS
  // ==========================================================================
  
  describe("Text Transformation Operations", () => {
    it("should remove punctuations correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.RemovePunctuations]: true,
      });

      const result = await analyser.main();
      expect(result.output).not.toContain("!");
      expect(result.output).not.toContain(",");
      expect(result.output).not.toContain(".");
    });

    it("should remove numbers correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.RemoveNumbers]: true,
      });

      const result = await analyser.main();
      expect(result.output).not.toContain("1");
      expect(result.output).not.toContain("2");
      expect(result.output).not.toContain("3");
    });

    it("should convert to uppercase correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ConvertToUppercase]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe(sampleText.toUpperCase());
    });

    it("should convert to lowercase correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.ConvertToLowercase]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe(sampleText.toLowerCase());
    });

    it("should convert to title case correctly", async () => {
      const analyser = await Analyser.create("hello world test", {
        [Operations.ConvertToTitleCase]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe("Hello World Test");
    });

    it("should reverse text correctly", async () => {
      const testText = "Hello";
      const analyser = await Analyser.create(testText, {
        [Operations.ReverseText]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe("olleH");
    });

    it("should truncate text correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.Truncate]: {
          maxLength: 10,
          suffix: "...",
        },
      });

      const result = await analyser.main();
      expect(result.output).toBe("Hello Worl...");
      expect(result.output.length).toBe(13); // 10 + 3 (suffix)
    });
  });

  // ==========================================================================
  // ADVANCED ANALYSIS TESTS
  // ==========================================================================
  
  describe("Advanced Analysis Operations", () => {
    it("should analyze sentiment correctly", async () => {
      const sentimentText = "This is a very good and happy result.";
      const analyser = await Analyser.create(sentimentText, {
        [Operations.AnalyzeSentiment]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.sentiment).toBeDefined();
      expect(result.metadata.sentiment?.classification).toBe("positive");
      expect(typeof result.metadata.sentiment?.score).toBe("number");
      expect(result.metadata.sentiment?.score).toBeGreaterThan(-1);
      expect(result.metadata.sentiment?.score).toBeLessThanOrEqual(1);
    });

    it("should calculate readability metrics", async () => {
      const text =
        "The quick brown fox jumps over the lazy dog. It was a bright cold day in April, and the clocks were striking thirteen.";
      const analyser = await Analyser.create(text, {
        [Operations.CalculateReadability]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.readability).toBeDefined();
      expect(result.metadata.readability?.readabilityScore).toBeDefined();
      expect(result.metadata.readability?.smogIndex).toBeDefined();
      expect(result.metadata.readability?.gradeLevel).toBeDefined();
      expect(result.metadata.readability?.complexity).toBe("Very Easy");
    });

    it("should detect English language correctly", async () => {
      const englishText =
        "Hello, this is a comprehensive sentence written in the English language.";
      const analyser = await Analyser.create(englishText, {
        [Operations.DetectLanguage]: true,
      }, {
        blacklist: ["sco"]
      });

      const result = await analyser.main();
      expect(result.metadata.languageDetection).toBeDefined();
      expect(result.metadata.languageDetection?.languageName).toBe("English");
      expect(result.metadata.languageDetection?.detectedLanguage).toBe("eng");
      expect(result.metadata.languageDetection?.confidence).toBeGreaterThan(0.5);
    });

    it("should detect Spanish language correctly", async () => {
      const spanishText =
        "Hola, esta es una oración completa escrita en idioma español.";
      const analyser = await Analyser.create(spanishText, {
        [Operations.DetectLanguage]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.languageDetection).toBeDefined();
      expect(result.metadata.languageDetection?.languageName).toBe("Spanish");
      expect(result.metadata.languageDetection?.detectedLanguage).toBe("spa");
      expect(result.metadata.languageDetection?.confidence).toBeGreaterThan(0.5);
    });

    it("should handle short text with low confidence", async () => {
      const shortText = "Hi";
      const analyser = await Analyser.create(shortText, {
        [Operations.DetectLanguage]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.languageDetection).toBeDefined();
      expect(result.metadata.languageDetection?.detectedLanguage).toBe("und");
      expect(result.metadata.languageDetection?.confidence).toBeLessThanOrEqual(0.5);
    });
  });

  // ==========================================================================
  // CUSTOM OPERATIONS TESTS
  // ==========================================================================
  
  describe("Custom Operations", () => {
    it("should add and execute custom operation correctly", async () => {
      const analyser = await Analyser.create("Test string");

      await analyser.addCustomOperation(
        "surroundWithAsterisks",
        "Surround With Asterisks",
        {
          operation: (text) => `*${text}*`,
          isEnabled: true,
          metadata: { decorationType: "asterisks" },
        },
      );

      const result = await analyser.main();
      expect(result.output).toBe("*Test string*");
      expect(result.customOperations).toContain("Surround With Asterisks");
    });

    it("should handle metadata in custom operations", async () => {
      const analyser = await Analyser.create("Test string");

      await analyser.addCustomOperation("wordCounter", "Custom Word Counter", {
        operation: (text) => text,
        isEnabled: true,
        metadataExtractor: (text) => ({
          customWordCount: text.split(/\s+/).length,
        }),
      });

      const result = await analyser.main();
      expect(result.metadata.custom?.wordCounter.customWordCount).toBe(2);
    });

    it("should throw error for duplicate operation name", async () => {
      const analyser = await Analyser.create("Test string");

      await analyser.addCustomOperation("testOperation", "Test Operation", {
        operation: (text) => text,
        isEnabled: true,
      });

      await expect(
        analyser.addCustomOperation(
          "testOperation",
          "Duplicate Test Operation",
          {
            operation: (text) => text,
            isEnabled: true,
          },
        ),
      ).rejects.toThrow('Operation "testOperation" already exists');
    });
  });

  // ==========================================================================
  // OPERATION MANAGEMENT TESTS
  // ==========================================================================
  
  describe("Operation Management", () => {
    it("should toggle operations correctly", async () => {
      const analyser = await Analyser.create(sampleText);

      await analyser.toggleOperation("CountCharacters", true);
      expect(analyser.options["CountCharacters"]).toBe(true);

      await analyser.toggleOperation("CountCharacters", false);
      expect(analyser.options["CountCharacters"]).toBe(false);
    });

    it("should enable all operations correctly", async () => {
      const analyser = await Analyser.create(sampleText);
      await analyser.enableAllOperations();

      expect(analyser.options["CountCharacters"]).toBe(true);
      expect(analyser.options["ExtractUrls"]).toBe(true);
      expect(analyser.options["ConvertToUppercase"]).toBe(true);
    });

    it("should disable all operations correctly", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.CountCharacters]: true,
        [Operations.ExtractUrls]: true,
      });

      await analyser.disableAllOperations();

      expect(analyser.options["CountCharacters"]).toBe(false);
      expect(analyser.options["ExtractUrls"]).toBe(false);
    });

    it("should reset text correctly", async () => {
      const analyser = await Analyser.create("Original text", {
        fullcaps: true,
      });

      await analyser.main();
      await analyser.resetText("New text");
      expect(analyser.output).toBe("New text");

      await analyser.resetText();
      expect(analyser.output).toBe("New text");
    });
  });

  // ==========================================================================
  // STATIC METHODS TESTS
  // ==========================================================================
  
  describe("Static Methods", () => {
    it("should create analyzer with enabled operations", () => {
      const analyser = Analyser.createWithEnabledOperations(
        sampleText,
        ["CountCharacters", "ExtractUrls"],
      );

      expect(analyser.options[Operations.CountCharacters]).toBe(true);
      expect(analyser.options[Operations.ExtractUrls]).toBe(true);
      expect(analyser.options[Operations.ConvertToUppercase]).not.toBe(true);
    });

    it("should process batch texts correctly", async () => {
      const texts = [
        "First text with 123",
        "Second text with https://example.com",
      ];

      const results = await Analyser.batch(texts, {
        [Operations.CountCharacters]: true,
        [Operations.ExtractUrls]: true,
      });

      expect(results.length).toBe(2);
      expect(results[0].metadata.counts.characterCount).toBeGreaterThan(0);
      expect(results[1].metadata.urls).toContain("https://example.com");
    });
  });

  // ==========================================================================
  // ERROR HANDLING TESTS
  // ==========================================================================
  
  describe("Error Handling", () => {
    it("should throw error for invalid truncate configuration", async () => {
      const analyser = await Analyser.create(sampleText, {
        [Operations.Truncate]: true, // Missing maxLength
      });

      await expect(analyser.main()).rejects.toThrow(
        "Truncate operation requires a valid configuration",
      );
    });

    it("should throw error for invalid custom operation parameters", async () => {
      const analyser = await Analyser.create(sampleText);

      // Empty command name
      await expect(
        analyser.addCustomOperation("", "Test Operation", {
          operation: (text) => text,
          isEnabled: true,
        }),
      ).rejects.toThrow("Command name must be a non-empty string");

      // Empty log name
      await expect(
        analyser.addCustomOperation("validName", "", {
          operation: (text) => text,
          isEnabled: true,
        }),
      ).rejects.toThrow("Log name must be a non-empty string");

      // Invalid operation function
      await expect(
        analyser.addCustomOperation("validName", "Valid Log Name", {
          operation: null as any,
          isEnabled: true,
        }),
      ).rejects.toThrow("Operation must be a function");
    });
  });
});