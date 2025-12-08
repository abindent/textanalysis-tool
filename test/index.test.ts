import { Tools } from "../src";

// Mock global fetch to prevent network requests during testing
// This ensures LexiconLoader uses dummy data instead of hitting GitHub
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      text: () => Promise.resolve("good\t1.5\nbad\t-1.5"), // Mock VADER/IDF text
      json: () => Promise.resolve(["the", "and", "is"]), // Mock Stopwords JSON
    }),
  ) as jest.Mock;
});

describe("Text Analysis Tools", () => {
  const sampleText =
    "Hello World! This is a test string with 123 numbers, https://example.com URL, test@email.com, #hashtag, and @mention. It has multiple sentences too. The movie was good.";

  describe("Basic Functionality", () => {
    it("should initialize with provided text using the factory method", async () => {
      // Updated: Constructor is private, must use async create()
      const analyser = await Tools.Analyser.create(sampleText);
      expect(analyser.raw_text).toBe(sampleText);
    });

    it("should throw error for non-string input", async () => {
      // Updated: create() is async, so we expect the promise to reject
      await expect(Tools.Analyser.create(123 as any)).rejects.toThrow(
        "Input text must be a string",
      );
    });
  });

  describe("Built-in Operations", () => {
    it("should count characters correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.CountCharacters]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.characterCount).toBeGreaterThan(0);
    });

    it("should count alphabets correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.CountAlphabets]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.alphabetCount).toBeGreaterThan(0);
    });

    it("should count numbers correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.CountNumbers]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.numericCount).toBe(3); // 123
    });

    it("should extract URLs correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ExtractUrls]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.urls).toContain("https://example.com");
    });

    it("should extract emails correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ExtractEmails]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.emails).toContain("test@email.com");
    });

    it("should extract hashtags correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ExtractHashtags]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.hashtags).toContain("#hashtag");
    });

    it("should extract mentions correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ExtractMentions]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.mentions).toContain("@mention");
    });

    // --- New Semantic & Analysis Tests ---

    it("should extract keywords (TF-IDF) correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ExtractKeywords]: { topN: 3 },
      });

      const result = await analyser.main();
      // Expect keywords array to exist and have entries
      expect(result.metadata.keywords).toBeDefined();
      expect(Array.isArray(result.metadata.keywords)).toBe(true);
    });

    it("should analyze sentiment correctly", async () => {
      const sentimentText = "This is a very good and happy result.";
      const analyser = await Tools.Analyser.create(sentimentText, {
        [Tools.Operations.AnalyzeSentiment]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.sentiment).toBeDefined();
      // Check for the new ensemble structure
      expect(result.metadata.sentiment?.classification).toBe("positive");
      expect(typeof result.metadata.sentiment?.score).toBe("number");
    });

    it("should calculate readability metrics (SMOG/Flesch)", async () => {
      const text =
        "The quick brown fox jumps over the lazy dog. It was a bright cold day in April, and the clocks were striking thirteen.";
      const analyser = await Tools.Analyser.create(text, {
        [Tools.Operations.CalculateReadability]: true,
      });

      const result = await analyser.main();
      console.log(result.metadata.readability);
      expect(result.metadata.readability).toBeDefined();
      expect(result.metadata.readability?.readabilityScore).toBeDefined();
      expect(result.metadata.readability?.smogIndex).toBeDefined(); // Check for SMOG support
      expect(result.metadata.readability?.gradeLevel).toBeDefined();
      expect(result.metadata.readability?.complexity).toBe("Very Easy");
    });

    // -------------------------------------

    it("should remove punctuations correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.RemovePunctuations]: true,
      });

      const result = await analyser.main();
      expect(result.output).not.toContain("!");
      expect(result.output).not.toContain(",");
      expect(result.output).not.toContain(".");
    });

    it("should remove numbers correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.RemoveNumbers]: true,
      });

      const result = await analyser.main();
      expect(result.output).not.toContain("1");
      expect(result.output).not.toContain("2");
      expect(result.output).not.toContain("3");
    });

    it("should convert to uppercase correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ConvertToUppercase]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe(sampleText.toUpperCase());
    });

    it("should convert to lowercase correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.ConvertToLowercase]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe(sampleText.toLowerCase());
    });

    it("should convert to title case correctly", async () => {
      const analyser = await Tools.Analyser.create("hello world test", {
        [Tools.Operations.ConvertToTitleCase]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe("Hello World Test");
    });

    it("should count words correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.CountWords]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.wordCount).toBeGreaterThan(0);
    });

    it("should count sentences correctly", async () => {
      const simpleSentenceText =
        "This is the first sentence. This is the second sentence.";
      const analyser = await Tools.Analyser.create(simpleSentenceText, {
        [Tools.Operations.CountSentences]: true,
      });

      const result = await analyser.main();
      expect(result.metadata.counts.sentenceCount).toBe(2);
    });

    it("should reverse text correctly", async () => {
      const testText = "Hello";
      const analyser = await Tools.Analyser.create(testText, {
        [Tools.Operations.ReverseText]: true,
      });

      const result = await analyser.main();
      expect(result.output).toBe("olleH");
    });

    it("should truncate text correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.Truncate]: {
          maxLength: 10,
          suffix: "...",
        },
      });

      const result = await analyser.main();
      expect(result.output).toBe("Hello Worl...");
      expect(result.output.length).toBe(13); // 10 + length of suffix (3)
    });
  });

  describe("Custom Operations", () => {
    it("should add and execute custom operation correctly", async () => {
      const analyser = await Tools.Analyser.create("Test string");

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
      const analyser = await Tools.Analyser.create("Test string");

      await analyser.addCustomOperation("wordCounter", "Custom Word Counter", {
        operation: (text) => text, // No change to text
        isEnabled: true,
        metadataExtractor: (text) => ({
          customWordCount: text.split(/\s+/).length,
        }),
      });

      const result = await analyser.main();
      expect(result.metadata.custom?.wordCounter.customWordCount).toBe(2);
    });

    it("should throw error for duplicate operation name", async () => {
      const analyser = await Tools.Analyser.create("Test string");

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

  describe("Operation Management", () => {
    it("should toggle operations correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText);

      await analyser.toggleOperation("CountCharacters", true);
      expect(analyser.options["CountCharacters"]).toBe(true);

      await analyser.toggleOperation("CountCharacters", false);
      expect(analyser.options["CountCharacters"]).toBe(false);
    });

    it("should enable all operations correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText);
      await analyser.enableAllOperations();

      expect(analyser.options["CountCharacters"]).toBe(true);
      expect(analyser.options["ExtractUrls"]).toBe(true);
      expect(analyser.options["ConvertToUppercase"]).toBe(true);
    });

    it("should disable all operations correctly", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.CountCharacters]: true,
        [Tools.Operations.ExtractUrls]: true,
      });

      await analyser.disableAllOperations();

      expect(analyser.options["CountCharacters"]).toBe(false);
      expect(analyser.options["ExtractUrls"]).toBe(false);
    });

    it("should reset text correctly", async () => {
      const analyser = await Tools.Analyser.create("Original text", {
        fullcaps: true,
      });

      // Run operation to modify text
      await analyser.main();

      // Reset with new text
      await analyser.resetText("New text");
      expect(analyser.raw_text).toBe("New text");

      // Reset without argument should keep the current text
      await analyser.resetText();
      expect(analyser.raw_text).toBe("New text");
    });
  });

  describe("Static Methods", () => {
    it("should create analyzer with enabled operations correctly", async () => {
      // Updated: createWithEnabledOperations is now async
      const analyser = await Tools.Analyser.createWithEnabledOperations(
        sampleText,
        ["CountCharacters", "ExtractUrls"],
      );

      expect(analyser.options[Tools.Operations.CountCharacters]).toBe(true);
      expect(analyser.options[Tools.Operations.ExtractUrls]).toBe(true);
      expect(analyser.options[Tools.Operations.ConvertToUppercase]).not.toBe(
        true,
      );
    });

    it("should process batch texts correctly", async () => {
      const texts = [
        "First text with 123",
        "Second text with https://example.com",
      ];

      const results = await Tools.Analyser.batch(texts, {
        [Tools.Operations.CountCharacters]: true,
        [Tools.Operations.ExtractUrls]: true,
      });

      expect(results.length).toBe(2);
      expect(results[0].metadata.counts.characterCount).toBeGreaterThan(0);
      expect(results[1].metadata.urls).toContain("https://example.com");
    });
  });

  describe("Error Handling", () => {
    it("should throw error for invalid truncate configuration", async () => {
      const analyser = await Tools.Analyser.create(sampleText, {
        [Tools.Operations.Truncate]: true, // Invalid config
      });

      await expect(analyser.main()).rejects.toThrow(
        "Truncate operation requires a valid configuration",
      );
    });

    it("should throw error for invalid custom operation parameters", async () => {
      const analyser = await Tools.Analyser.create(sampleText);

      await expect(
        analyser.addCustomOperation(
          "", // Empty name
          "Test Operation",
          {
            operation: (text) => text,
            isEnabled: true,
          },
        ),
      ).rejects.toThrow("Command name must be a non-empty string");

      await expect(
        analyser.addCustomOperation(
          "validName",
          "", // Empty log name
          {
            operation: (text) => text,
            isEnabled: true,
          },
        ),
      ).rejects.toThrow("Log name must be a non-empty string");

      await expect(
        analyser.addCustomOperation("validName", "Valid Log Name", {
          operation: null as any, // Invalid operation
          isEnabled: true,
        }),
      ).rejects.toThrow("Operation must be a function");
    });
  });
});
