# 🌟 Text Analysis Tools 🌟

[![npm version](https://img.shields.io/npm/v/textanalysis-tool.svg)](https://www.npmjs.com/package/textanalysis-tool) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-blue)](https://www.typescriptlang.org/)

> 🚀 A lightning-fast ⚡ TypeScript library for 🤖 text analysis and 🔧 manipulation. Bundled with everything from simple cleanup to deep linguistic insights! 📦

---

## 🗂️ Table of Contents

- [⬇️ Installation](#️-installation)
- [🧩 Usage](#-usage)
  - [📰 Basic Usage](#-basic-usage)
  - [⚙️ Working with Operations](#️-working-with-operations)
  - [🧠 Advanced Analysis](#-advanced-analysis)
  - [🏭 Using Factory Methods](#-using-factory-methods)
  - [📦 Batch Processing](#-batch-processing)
- [🛠️ Available Operations](#️-available-operations)
- [🎨 Custom Operations](#-custom-operations)
- [🚀 Advanced Usage](#-advanced-usage)
- [🔬 Direct Use of Analytical Extensions](#-direct-use-of-analytical-extensions)
- [📘 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ⬇️ Installation

> _Install in one click! ✨_

```bash
npm install textanalysis-tool
```

via pnpm:

```bash
pnpm add textanalysis-tool
```

via yarn:

```bash
yarn add textanalysis-tool
```

---

## 🧩 Usage

### 📰 Basic Usage

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const text =
  "This is a sample text with 123 numbers and https://example.com URL!";

// Create analyzer using factory method (recommended)
const analyser = await Analyser.create(text, {
  [Operations.CountCharacters]: true,
  [Operations.CountWords]: true,
  [Operations.ExtractUrls]: true,
});

// Run the analysis
const result = await analyser.main();

console.log("Text analysis results:");
console.log(`- Character count: ${result.metadata.counts.characterCount}`);
console.log(`- Word count: ${result.metadata.counts.wordCount}`);
console.log(`- URLs found: ${result.metadata.urls?.join(", ")}`);
console.log(`- Operations performed: ${result.operations.join(", ")}`);
console.log(`- Execution time: ${result.executionTime}ms`);
```

### ⚙️ Working with Operations

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const analyser = await Analyser.create("Hello, world! 123 #hashtag @mention", {
  // Enable specific operations
  [Operations.RemovePunctuations]: true,
  [Operations.RemoveNumbers]: true,
  [Operations.ConvertToUppercase]: true,
});

const result = await analyser.main();
console.log(result.output); // "HELLO WORLD HASHTAG MENTION"
```

### 🧠 Advanced Analysis

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const paragraph = `This tool is amazing 🎯. Sometimes you need exact control.`;

const analyser = await Analyser.create(paragraph, {
  [Operations.AnalyzeSentiment]: true,
  [Operations.CalculateReadability]: true,
  [Operations.DetectLanguage]: true,
  [Operations.ExtractKeywords]: { topN: 5 },
  [Operations.CompareTexts]: { compareWith: "Other example text." },
});

const result = await analyser.main();

console.log("❤️ Sentiment:", result.metadata.sentiment);
console.log("📖 Readability:", result.metadata.readability);
console.log("🌍 Language:", result.metadata.languageDetection);
console.log("🔍 Text Diff:", result.metadata.textComparison);
console.log("🔑 Keywords:", result.metadata.keywords);
```

### 🏭 Using Factory Methods

```typescript
import { Analyser, Operations } from "textanalysis-tool";

// Create an analyzer with specific operations enabled
const analyser = Analyser.createWithEnabledOperations("Hello, world! 123", [
  "CountCharacters",
  "CountWords",
  "RemovePunctuations",
]);

const result = await analyser.main();
console.log(result.output); // "Hello world 123"
console.log(`Words: ${result.metadata.counts.wordCount}`);
console.log(`Characters: ${result.metadata.counts.characterCount}`);
```

### 📦 Batch Processing

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const texts = [
  "First sample with https://example1.com",
  "Second sample 12345 with #hashtags",
  "Third sample with @mentions and emails@example.com",
];

const options = {
  [Operations.CountWords]: true,
  [Operations.ExtractUrls]: true,
  [Operations.ExtractHashtags]: true,
  [Operations.ExtractMentions]: true,
  [Operations.ExtractEmails]: true,
};

const results = await Analyser.batch(texts, options);

results.forEach((result, index) => {
  console.log(`\nAnalysis of text #${index + 1}:`);
  console.log(`- Word count: ${result.metadata.counts.wordCount}`);
  console.log(`- URLs: ${result.metadata.urls?.join(", ") || "None"}`);
  console.log(`- Hashtags: ${result.metadata.hashtags?.join(", ") || "None"}`);
  console.log(`- Mentions: ${result.metadata.mentions?.join(", ") || "None"}`);
  console.log(`- Emails: ${result.metadata.emails?.join(", ") || "None"}`);
});
```

---

## 🛠️ Available Operations

### 🗑️ Text Removal

| Operation            | Description             | Example Input   | Example Output |
| -------------------- | ----------------------- | --------------- | -------------- |
| `RemovePunctuations` | 🧹 Remove punctuation   | "Hello, world!" | "Hello world"  |
| `RemoveNumbers`      | 🔢 Remove numbers       | "abc123def"     | "abcdef"       |
| `RemoveAlphabets`    | 🔡 Remove alphabets     | "abc123def"     | "123"          |
| `RemoveSpecialChars` | ✨ Remove special chars | "Hi @you #1!"   | "Hi you 1"     |
| `RemoveNewlines`     | ↩️ Remove newlines      | "Hello\nWorld"  | "Hello World"  |
| `RemoveExtraSpaces`  | 📏 Trim extra spaces    | " Hi there "    | "Hi there"     |

### 📤 Text Extraction

| Operation             | Description                  | Example Input                   | Example Output            |
| --------------------- | ---------------------------- | ------------------------------- | ------------------------- |
| `ExtractUrls`         | 🌐 Extract URLs              | "Visit https://a.com and b.org" | ["https://a.com"]         |
| `ExtractEmails`       | ✉️ Extract emails            | "Email me at user@test.com"     | ["user@test.com"]         |
| `ExtractPhoneNumbers` | 📞 Extract phone numbers     | "Call 123-456-7890"             | ["123-456-7890"]          |
| `ExtractHashtags`     | #️⃣ Extract hashtags          | "#fun #code"                    | ["#fun","#code"]          |
| `ExtractMentions`     | @️⃣ Extract mentions          | "Hi @user!"                     | ["@user"]                 |
| `ExtractKeywords`     | 🔑 Extract keywords (TF-IDF) | "The quick brown fox"           | ["quick", "brown", "fox"] |

### 🔄 Text Transformation

| Operation            | Description             | Example Input          | Example Output |
| -------------------- | ----------------------- | ---------------------- | -------------- |
| `ConvertToUppercase` | 🔠 UPPERCASE conversion | "Hello World"          | "HELLO WORLD"  |
| `ConvertToLowercase` | 🔡 lowercase conversion | "Hello World"          | "hello world"  |
| `ConvertToTitleCase` | 🆎 Title Case           | "hello world"          | "Hello World"  |
| `ReverseText`        | 🔄 Reverse text         | "abcde"                | "edcba"        |
| `Truncate`           | ✂️ Truncate text        | (maxLength=5) "abcdef" | "abcde..."     |

### 🔢 Text Counting

| Operation           | Description              | Example Input | Example Output    |
| ------------------- | ------------------------ | ------------- | ----------------- |
| `CountCharacters`   | 🔠 Count non-space chars | "Hi!"         | 3                 |
| `CountAlphabets`    | 🔤 Count letters         | "A1b2C"       | 3                 |
| `CountNumbers`      | 🔢 Count digits          | "A1b2C"       | 2                 |
| `CountAlphanumeric` | 🔤 Letters+digits count  | "A1 b2!"      | { alph:3, num:2 } |
| `CountWords`        | 📝 Count words           | "Hello world" | 2                 |
| `CountSentences`    | 📄 Count sentences       | "Hi. Bye?"    | 2                 |

### 🔮 Advanced Analysis Options

| Operation              | Description                      | Example Input                   | Example Output                                       |
| ---------------------- | -------------------------------- | ------------------------------- | ---------------------------------------------------- |
| `AnalyzeSentiment`     | ❤️ Sentiment analysis (Ensemble) | "I love this!"                  | `{ score:0.8, classification:"positive" }`           |
| `CalculateReadability` | 📖 Flesch-Kincaid & SMOG scores  | "The quick brown fox jumps..."  | `{ readabilityScore:70, gradeLevel:5, smogIndex:7 }` |
| `DetectLanguage`       | 🌍 Language detection            | "Bonjour le monde"              | `{ detectedLanguage:"fra", confidence:90 }`          |
| `CompareTexts`         | 🔍 Text diff & similarity        | `{ compareWith: "other text" }` | `{ similarity:45.5, wordDifference:{...} }`          |
| `ExtractKeywords`      | 🔑 TF-IDF keyword extraction     | "machine learning algorithms"   | `["machine", "learning", "algorithms"]`              |

---

## 🎨 Custom Operations

_Easily plug in your own workflows! ✨_

### ➕ Adding Custom Operations

You can extend functionality by adding your own custom operations:

```typescript
import { Analyser } from "textanalysis-tool";

const analyser = await Analyser.create("Sample text for custom operation");

// Add a simple custom operation
await analyser.addCustomOperation(
  "surroundWithAsterisks", // Command name
  "Surround With Asterisks", // Log name
  {
    operation: (text) => `*${text}*`, // Operation function
    isEnabled: true, // Enable immediately
    metadata: { decorationType: "asterisks" }, // Additional metadata
  },
);

// Run the analysis with the custom operation
const result = await analyser.main();
console.log(result.output); // "*Sample text for custom operation*"
console.log(result.metadata.custom?.surroundWithAsterisks); // { decorationType: "asterisks" }
```

### 📊 With Metadata Extraction

```typescript
import { Analyser } from "textanalysis-tool";

const analyser = await Analyser.create("The code is 12345 and the pin is 6789");

// Add a custom operation with metadata extraction
await analyser.addCustomOperation(
  "extractNumericCodes",
  "Extract Numeric Codes",
  {
    operation: (text) => text, // Operation doesn't change the text
    isEnabled: true,
    metadataExtractor: (text) => {
      const allNumbers = text.match(/\d+/g) || [];
      return {
        codes: allNumbers,
        codeCount: allNumbers.length,
      };
    },
  },
);

const result = await analyser.main();
console.log(result.metadata.custom?.extractNumericCodes);
// Output: { codes: ["12345", "6789"], codeCount: 2 }
```

---

## 🚀 Advanced Usage

### 🔘 Toggling Operations

Enable or disable operations dynamically:

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const analyser = await Analyser.create("Sample text with 123 numbers");

// Enable specific operations
await analyser.toggleOperation(Operations.RemoveNumbers, true);
await analyser.toggleOperation(Operations.CountCharacters, true);

// Run analysis
let result = await analyser.main();
console.log(result.output); // "Sample text with  numbers"

// Disable and enable different operations
await analyser.toggleOperation(Operations.RemoveNumbers, false);
await analyser.toggleOperation(Operations.ConvertToUppercase, true);

// Run analysis again with new settings
result = await analyser.main();
console.log(result.output); // "SAMPLE TEXT WITH 123 NUMBERS"
```

### 🔀 Managing Multiple Operations

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const analyser = await Analyser.create("Hello, world! 123");

// Enable all available operations
await analyser.enableAllOperations();

// Run with all operations
let result = await analyser.main();
console.log("With all operations:", result.output);

// Disable all operations
await analyser.disableAllOperations();

// Enable only specific operations
await analyser.toggleOperation(Operations.RemovePunctuations, true);
await analyser.toggleOperation(Operations.ConvertToUppercase, true);

// Run with only selected operations
result = await analyser.main();
console.log("With selected operations:", result.output); // "HELLO WORLD 123"
```

### 🔄 Resetting Text

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const analyser = await Analyser.create("Original text", {
  [Operations.ConvertToUppercase]: true,
});

// Run first analysis
let result = await analyser.main();
console.log(result.output); // "ORIGINAL TEXT"

// Reset with new text
await analyser.resetText("New content");

// Run analysis again
result = await analyser.main();
console.log(result.output); // "NEW CONTENT"
```

### ✂️ Truncating Text

```typescript
import { Analyser, Operations } from "textanalysis-tool";

const longText =
  "This is a very long text that needs to be truncated to a reasonable length.";

const analyser = await Analyser.create(longText, {
  [Operations.Truncate]: {
    maxLength: 20,
    suffix: "...", // Optional, defaults to "..."
  },
});

const result = await analyser.main();
console.log(result.output); // "This is a very long..."
```

---

## 🔬 Direct Use of Analytical Extensions

You can use advanced analytical components directly (outside of `Analyser`) for specialized workflows:

### 😊 SentimentAnalyzer – Deep Dive

```typescript
import { SentimentAnalyzer } from "textanalysis-tool";

const sentimentAnalyzer = new SentimentAnalyzer();

// Example 1: Positive Text
const positiveResult = sentimentAnalyzer.analyze(
  "I absolutely love this amazing tool! It's fantastic and incredible!",
);
console.log("Positive Analysis:");
console.log(`Score: ${positiveResult.score}`); // ~0.6 to 0.8
console.log(`Classification: ${positiveResult.classification}`); // "positive"
console.log(`Positive Words: ${positiveResult.positiveWordCount}`);
console.log(`Negative Words: ${positiveResult.negativeWordCount}`);
console.log(`Total Words: ${positiveResult.totalWords}`);

// Example 2: Negative Text
const negativeResult = sentimentAnalyzer.analyze(
  "This is terrible, awful, and the worst experience ever.",
);
console.log("\nNegative Analysis:");
console.log(`Score: ${negativeResult.score}`); // ~-0.6 to -0.8
console.log(`Classification: ${negativeResult.classification}`); // "negative"

// Example 3: Neutral Text
const neutralResult = sentimentAnalyzer.analyze("The weather today is cloudy.");
console.log("\nNeutral Analysis:");
console.log(`Score: ${neutralResult.score}`); // ~-0.1 to 0.1
console.log(`Classification: ${neutralResult.classification}`); // "neutral"

// Example 4: Mixed Sentiment
const mixedResult = sentimentAnalyzer.analyze(
  "The product is good but the delivery was terrible.",
);
console.log("\nMixed Sentiment Analysis:");
console.log(`Score: ${mixedResult.score}`);
console.log(`Classification: ${mixedResult.classification}`);
console.log(`Positive Words: ${mixedResult.positiveWordCount}`);
console.log(`Negative Words: ${mixedResult.negativeWordCount}`);
```

**Output Example:**

```
Positive Analysis:
  Score: 0.72
  Classification: positive
  Positive Words: 4
  Negative Words: 0
  Total Words: 10

Neutral Analysis:
  Score: -0.02
  Classification: neutral
```

---

### 📊 CalculateReadability – Complete Guide

```typescript
import { TextStatistics } from "textanalysis-tool";

const textStats = new TextStatistics();

// Example 1: Simple Text (High Readability)
const simpleText = "The cat sat on the mat. It was happy.";
const simpleReadability = textStats.fleschKincaidReadability(simpleText);
console.log("Simple Text Analysis:");
console.log(`Readability Score: ${simpleReadability.readabilityScore}`); // ~85-95
console.log(`Grade Level: ${simpleReadability.gradeLevel}`); // ~1-3
console.log(`SMOG Index: ${simpleReadability.smogIndex}`); // ~3-4
console.log(`Complexity: ${simpleReadability.complexity}`); // "Very Easy" or "Easy"
console.log(`Word Count: ${simpleReadability.wordCount}`);
console.log(`Sentence Count: ${simpleReadability.sentenceCount}`);
console.log(`Avg Words/Sentence: ${simpleReadability.avgWordsPerSentence}`);
console.log(`Avg Syllables/Word: ${simpleReadability.avgSyllablesPerWord}`);

// Example 2: Complex Academic Text
const academicText = `
  Comprehensive analysis of multifaceted organizational paradigms necessitates 
  sophisticated methodological frameworks. Contemporary methodological approaches 
  facilitate understanding of pedagogical mechanisms and institutional structures.
`;
const complexReadability = textStats.fleschKincaidReadability(academicText);
console.log("\nComplex Academic Text Analysis:");
console.log(`Readability Score: ${complexReadability.readabilityScore}`); // ~20-35
console.log(`Grade Level: ${complexReadability.gradeLevel}`); // ~14-18 (College level)
console.log(`Complexity: ${complexReadability.complexity}`); // "Very Difficult" or "Difficult"

// Example 3: News Article (Medium Readability)
const newsText = `
  The technology sector continues to evolve rapidly. Artificial intelligence 
  is transforming businesses worldwide. Companies are investing significantly 
  in machine learning infrastructure.
`;
const newsReadability = textStats.fleschKincaidReadability(newsText);
console.log("\nNews Article Analysis:");
console.log(`Readability Score: ${newsReadability.readabilityScore}`); // ~50-65
console.log(`Grade Level: ${newsReadability.gradeLevel}`); // ~8-11
console.log(`Complexity: ${newsReadability.complexity}`); // "Fairly Difficult" or "Standard"
```

**Readability Scale:**

```
90-100: Very Easy (5th grade)
80-89:  Easy (6th grade)
70-79:  Fairly Easy (7th grade)
60-69:  Standard (8th-9th grade)
50-59:  Fairly Difficult (10th-12th grade)
30-49:  Difficult (College level)
0-29:   Very Difficult (College graduate)
```

---

### 🔄 CompareTexts – Text Comparison & Diff

```typescript
import { TextDiff } from "textanalysis-tool";

const textDiff = new TextDiff();

// Example 1: Simple Comparison
const text1 = "I love cats and dogs";
const text2 = "I love cats and birds";

const diff1 = textDiff.compare(text1, text2);
console.log("Simple Text Comparison:");
console.log(`Similarity: ${diff1.similarity.toFixed(2)}%`); // ~80%
console.log(`Added Words: ${diff1.wordDifference.added.join(", ")}`); // "birds"
console.log(`Removed Words: ${diff1.wordDifference.removed.join(", ")}`); // "dogs"
console.log(`Unchanged Words: ${diff1.wordDifference.unchangedCount}`); // 4

// Example 2: Code Comparison
const originalCode = "const x = 10; const y = 20; console.log(x + y);";
const modifiedCode = "const x = 10; const y = 30; console.log(x + y);";

const diff2 = textDiff.compare(originalCode, modifiedCode);
console.log("\nCode Comparison:");
console.log(`Similarity: ${diff2.similarity.toFixed(2)}%`);
console.log(`Changes Detected:`);
console.log(`+ Added: ${diff2.wordDifference.added.join(", ") || "None"}`);
console.log(`- Removed: ${diff2.wordDifference.removed.join(", ") || "None"}`);

// Example 3: Document Versioning
const v1 = "The project timeline extends to Q3 2024 with multiple milestones";
const v2 =
  "The project timeline extends to Q4 2024 with several key milestones";

const diff3 = textDiff.compare(v1, v2);
console.log("\nDocument Version Comparison:");
console.log(
  `Similarity Ratio: ${(diff3.similarity / 100).toFixed(2)} (0.0-1.0)`,
);
console.log(`Word Statistics:`);
console.log(`+ Total Added: ${diff3.wordDifference.addedCount}`);
console.log(`- Total Removed: ${diff3.wordDifference.removedCount}`);
console.log(`= Unchanged: ${diff3.wordDifference.unchangedCount}`);

// Example 4: Full Diff Output
const before = "apple banana cherry date";
const after = "apple blueberry cherry fig";

const fullDiff = textDiff.compare(before, after);
console.log("\nFull Difference Report:");
console.log(`+ Added: [${fullDiff.wordDifference.added.join(", ")}]`);
console.log(`- Removed: [${fullDiff.wordDifference.removed.join(", ")}]`);
console.log(`= Unchanged: [${fullDiff.wordDifference.unchanged.join(", ")}]`);
console.log(`Overall Similarity: ${fullDiff.similarity.toFixed(1)}%`);
```

---

### 🌍 Language Detection

```typescript
import { LanguageDetector } from "textanalysis-tool";

const detector = new LanguageDetector();

// Example 1: English Detection
const englishText = "Hello, how are you today? This is a beautiful day.";
const engResult = detector.detect(englishText);
console.log("English Detection:");
console.log(`Detected Language: ${engResult.detectedLanguage}`); // "eng"
console.log(`Language Name: ${engResult.languageName}`); // "English"
console.log(`Confidence: ${engResult.confidence.toFixed(1)}%`); // ~90-95%
console.log(`Alternative Languages:`, engResult.alternativeLanguages);

// Example 2: French Detection
const frenchText = "Bonjour, comment allez-vous? C'est une belle journée.";
const frResult = detector.detect(frenchText);
console.log("\nFrench Detection:");
console.log(`Detected Language: ${frResult.detectedLanguage}`); // "fra"
console.log(`Language Name: ${frResult.languageName}`); // "French"
console.log(`Confidence: ${frResult.confidence.toFixed(1)}%`);

// Example 3: Spanish Detection
const spanishText = "Hola, ¿cómo estás? Este es un hermoso día.";
const esResult = detector.detect(spanishText);
console.log("\nSpanish Detection:");
console.log(`Detected Language: ${esResult.detectedLanguage}`); // "spa"
console.log(`Language Name: ${esResult.languageName}`); // "Spanish"
console.log(`Confidence: ${esResult.confidence.toFixed(1)}%`);

// Example 4: With Options (Whitelist/Blacklist)
const multiLangText = "Hello world";
const customResult = detector.detect(multiLangText, {
  whitelist: ["eng", "fra", "deu"], // Only consider these languages
  minLength: 5, // Minimum text length
});
console.log("\nCustom Detection with Options:");
console.log(
  `Detected: ${customResult.languageName} (${customResult.detectedLanguage})`,
);
console.log(`Confidence: ${customResult.confidence.toFixed(1)}%`);

// Example 5: Multilingual Detection
const multilingualTexts = [
  { text: "Good morning world", lang: "English" },
  { text: "Buenos días mundo", lang: "Spanish" },
  { text: "Guten Morgen Welt", lang: "German" },
  { text: "Bonjour le monde", lang: "French" },
];

console.log("\nMultilingual Detection Results:");
multilingualTexts.forEach((item) => {
  const result = detector.detect(item.text);
  console.log(
    `  ${item.lang}: ${result.languageName} (${result.detectedLanguage}) - ${result.confidence.toFixed(0)}%`,
  );
});
```

---

### 🎯 Combined Analysis Example

```typescript
import {
  Analyser,
  Operations,
  SentimentAnalyzer,
  TextStatistics,
  TextDiff,
  LanguageDetector,
} from "textanalysis-tool";

// Complete analysis of customer feedback
async function analyzeCustomerFeedback(feedback: string) {
  // Initialize all analyzers
  const sentiment = new SentimentAnalyzer();
  const stats = new TextStatistics();
  const detector = new LanguageDetector();

  // Perform analyses
  const sentimentResult = sentiment.analyze(feedback);
  const readabilityResult = stats.fleschKincaidReadability(feedback);
  const languageResult = detector.detect(feedback);

  // Use Analyser for additional metrics
  const analyser = await Analyser.create(feedback, {
    [Operations.CountWords]: true,
    [Operations.CountSentences]: true,
    [Operations.ExtractKeywords]: { topN: 5 },
  });

  const toolsResult = await analyser.main();

  // Compile comprehensive report
  const report = {
    sentiment: {
      score: sentimentResult.score,
      classification: sentimentResult.classification,
      positiveWords: sentimentResult.positiveWordCount,
      negativeWords: sentimentResult.negativeWordCount,
    },
    readability: {
      score: readabilityResult.readabilityScore,
      gradeLevel: readabilityResult.gradeLevel,
      complexity: readabilityResult.complexity,
      avgWordsPerSentence: readabilityResult.avgWordsPerSentence,
    },
    language: {
      detected: languageResult.languageName,
      code: languageResult.detectedLanguage,
      confidence: languageResult.confidence.toFixed(1) + "%",
    },
    content: {
      wordCount: toolsResult.metadata.counts.wordCount,
      sentenceCount: toolsResult.metadata.counts.sentenceCount,
      keywords: toolsResult.metadata.keywords,
    },
  };

  return report;
}

// Usage
const feedback =
  "This product is amazing! I absolutely love the quality and support. Highly recommended!";
analyzeCustomerFeedback(feedback).then((report) => {
  console.log("Customer Feedback Analysis Report:");
  console.log(JSON.stringify(report, null, 2));
});
```

**Output:**

```json
{
  "sentiment": {
    "score": 0.75,
    "classification": "positive",
    "positiveWords": 3,
    "negativeWords": 0
  },
  "readability": {
    "score": 78.5,
    "gradeLevel": 5.2,
    "complexity": "Fairly Easy",
    "avgWordsPerSentence": 5.3
  },
  "language": {
    "detected": "English",
    "code": "eng",
    "confidence": "92.5%"
  },
  "content": {
    "wordCount": 16,
    "sentenceCount": 3,
    "keywords": ["product", "quality", "support", "love", "recommended"]
  }
}
```

---

## 📘 API Reference

### 🧰 Analyser Class

The main class for text analysis operations with support for both built-in and custom operations.

#### Static Methods

##### `Analyser.create()` (Recommended)

**Description:** Asynchronous factory method that initializes the Analyser with pre-loaded lexicons and IDF maps for optimal performance.
```typescript
static async create(
  raw_text: string,
  options?: AnalyserBuiltInOptions,
  languageOptions?: {
    whitelist?: string[];
    blacklist?: string[];
    minLength?: number;
  }
): Promise<Analyser>
```

**Parameters:**
- `raw_text` (string): The input text to analyze
- `options` (AnalyserBuiltInOptions, optional): Configuration object for enabling operations
- `languageOptions` (object, optional): Language detection options
  - `whitelist` (string[]): ISO 639-3 language codes to consider
  - `blacklist` (string[]): ISO 639-3 language codes to ignore
  - `minLength` (number): Minimum text length for language detection

**Returns:** `Promise<Analyser>` - A fully initialized Analyser instance

**Example:**
```typescript
const analyser = await Analyser.create("Sample text", {
  [Operations.CountWords]: true,
  [Operations.AnalyzeSentiment]: true
});
```

---

##### `Analyser.createWithEnabledOperations()`

**Description:** Synchronous factory method to create an Analyser with specific operations enabled.
```typescript
static createWithEnabledOperations(
  text: string,
  operations: (keyof typeof Operations)[]
): Analyser
```

**Parameters:**
- `text` (string): The input text to analyze
- `operations` (Array): Array of operation names to enable

**Returns:** `Analyser` - Analyser instance with specified operations enabled

**Example:**
```typescript
const analyser = Analyser.createWithEnabledOperations(
  "Hello World 123",
  ["CountWords", "RemoveNumbers", "ConvertToUppercase"]
);
```

---

##### `Analyser.batch()`

**Description:** Process multiple texts with the same operations in batch mode.
```typescript
static async batch(
  texts: string[],
  options: AnalyserBuiltInOptions
): Promise<AnalyserResult[]>
```

**Parameters:**
- `texts` (string[]): Array of texts to process
- `options` (AnalyserBuiltInOptions): Operations to apply to all texts

**Returns:** `Promise<AnalyserResult[]>` - Array of analysis results

**Example:**
```typescript
const results = await Analyser.batch(
  ["Text 1", "Text 2", "Text 3"],
  { [Operations.CountWords]: true }
);
```

---

#### Instance Methods

##### `main()`

**Description:** Executes all enabled operations and returns comprehensive analysis results.
```typescript
async main(): Promise<AnalyserResult>
```

**Returns:** `Promise<AnalyserResult>` - Complete analysis results

**Example:**
```typescript
const analyser = await Analyser.create("Sample text", options);
const result = await analyser.main();
console.log(result.output);
console.log(result.metadata);
```

---

##### `addCustomOperation()`

**Description:** Dynamically adds a custom text operation to the analyser.
```typescript
async addCustomOperation(
  commandName: string,
  logName: string,
  config: {
    operation: (text: string) => string;
    isEnabled?: boolean;
    metadata?: Record<string, any>;
    metadataExtractor?: (text: string) => any;
  }
): Promise<void>
```

**Parameters:**
- `commandName` (string): Unique identifier for the operation
- `logName` (string): Human-readable name for logging
- `config` (object): Configuration object
  - `operation` (function): Function that transforms the text
  - `isEnabled` (boolean, optional): Enable immediately (default: false)
  - `metadata` (object, optional): Static metadata to include in results
  - `metadataExtractor` (function, optional): Function to extract dynamic metadata

**Throws:** Error if commandName already exists or parameters are invalid

**Example:**
```typescript
await analyser.addCustomOperation(
  "wrapInQuotes",
  "Wrap in Quotes",
  {
    operation: (text) => `"${text}"`,
    isEnabled: true,
    metadata: { wrapType: "double-quotes" },
    metadataExtractor: (text) => ({ originalLength: text.length })
  }
);
```

---

##### `toggleOperation()`

**Description:** Enable or disable an operation dynamically.
```typescript
async toggleOperation(
  commandName: string,
  isEnabled: boolean
): Promise<void>
```

**Parameters:**
- `commandName` (string): Name of the operation to toggle
- `isEnabled` (boolean): True to enable, false to disable

**Throws:** Error if operation doesn't exist

**Example:**
```typescript
await analyser.toggleOperation(Operations.RemoveNumbers, true);
await analyser.toggleOperation(Operations.CountWords, false);
```

---

##### `enableAllOperations()`

**Description:** Enables all available built-in and custom operations.
```typescript
async enableAllOperations(): Promise<void>
```

**Example:**
```typescript
await analyser.enableAllOperations();
const result = await analyser.main();
```

---

##### `disableAllOperations()`

**Description:** Disables all operations.
```typescript
async disableAllOperations(): Promise<void>
```

**Example:**
```typescript
await analyser.disableAllOperations();
```

---

##### `resetText()`

**Description:** Resets the text to original or sets new text, clearing all counters and extracted data.
```typescript
async resetText(newText?: string): Promise<void>
```

**Parameters:**
- `newText` (string, optional): New text to set. If omitted, resets to original

**Example:**
```typescript
await analyser.resetText("New text content");
```

---

#### Properties

##### `availableOperations`

**Description:** Read-only property returning all available operations (built-in + custom).

**Type:** `Record<string, string>`

**Example:**
```typescript
const ops = analyser.availableOperations;
console.log(Object.keys(ops)); // ["RemovePunctuations", "CountWords", ...]
```

---

##### `options`

**Description:** Get or set current operation options.

**Type:** `AnalyserBuiltInOptions`

**Example:**
```typescript
// Get current options
const currentOptions = analyser.options;

// Set new options
analyser.options = {
  [Operations.CountWords]: true,
  [Operations.RemoveNumbers]: false
};
```

---

### 📊 Result Interfaces

#### `AnalyserResult`

Complete analysis result returned by `main()`.
```typescript
interface AnalyserResult {
  purpose: string;                    // Comma-separated list of operations
  output: string;                     // Transformed text
  operations: string[];               // All operations performed
  builtInOperations: string[];        // Built-in operations performed
  customOperations: string[];         // Custom operations performed
  executionTime?: number;             // Execution time in milliseconds
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
    custom?: Record<string, any>;
  };
}
```

---

#### `SentimentResult`

Sentiment analysis result from `AnalyzeSentiment` operation.
```typescript
interface SentimentResult {
  score: number;                      // Sentiment score (-1 to 1)
  positiveWordCount: number;          // Number of positive words
  negativeWordCount: number;          // Number of negative words
  totalWords: number;                 // Total word count
  classification: "positive" | "negative" | "neutral";
}
```

---

#### `ReadabilityResult`

Readability metrics from `CalculateReadability` operation.
```typescript
interface ReadabilityResult {
  readabilityScore: number;           // Flesch Reading Ease (0-100)
  gradeLevel: number;                 // Flesch-Kincaid Grade Level
  smogIndex: number;                  // SMOG readability index
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  complexity: string;                 // "Very Easy" | "Easy" | "Standard" | etc.
}
```

---

#### `LanguageDetectionResult`

Language detection result from `DetectLanguage` operation.
```typescript
interface LanguageDetectionResult {
  detectedLanguage: string;           // ISO 639-3 language code
  languageName: string;               // Human-readable language name
  confidence: number;                 // Confidence score (0-100)
  scores: Record<string, number>;     // All language scores
  alternativeLanguages: Array<{
    language: string;
    languageName: string;
    confidence: number;
  }>;
}
```

---

#### `TextDiffResult`

Text comparison result from `CompareTexts` operation.
```typescript
interface TextDiffResult {
  similarity: number;                 // Similarity percentage (0-100)
  editDistance: number;               // Levenshtein distance
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
```

---

### 🔧 Extension Classes

These classes can be used independently for specialized analysis.

#### `SentimentAnalyzer`

Ensemble sentiment analysis combining Natural, WinkNLP, and Compromise libraries.
```typescript
class SentimentAnalyzer {
  constructor();
  analyze(text: string): SentimentResult;
}
```

**Example:**
```typescript
import { SentimentAnalyzer } from "textanalysis-tool";

const analyzer = new SentimentAnalyzer();
const result = analyzer.analyze("I love this product!");
console.log(result.score);          // 0.75
console.log(result.classification); // "positive"
```

---

#### `TextStatistics`

Calculate readability metrics using Flesch-Kincaid and SMOG formulas.
```typescript
class TextStatistics {
  fleschKincaidReadability(text: string): ReadabilityResult;
}
```

**Example:**
```typescript
import { TextStatistics } from "textanalysis-tool";

const stats = new TextStatistics();
const result = stats.fleschKincaidReadability("The quick brown fox jumps.");
console.log(result.readabilityScore); // 85.2
console.log(result.complexity);       // "Easy"
```

---

#### `LanguageDetector`

Detect language using n-gram profiles (supports 186 languages via franc library).
```typescript
class LanguageDetector {
  constructor(minTextLength?: number);
  detect(
    text: string,
    options?: {
      whitelist?: string[];
      blacklist?: string[];
      minLength?: number;
    }
  ): LanguageDetectionResult;
}
```

**Example:**
```typescript
import { LanguageDetector } from "textanalysis-tool";

const detector = new LanguageDetector();
const result = detector.detect("Bonjour le monde");
console.log(result.detectedLanguage); // "fra"
console.log(result.languageName);     // "French"
console.log(result.confidence);       // 95.2
```

---

#### `KeywordExtractor`

Extract keywords using TF-IDF (Term Frequency-Inverse Document Frequency).
```typescript
class KeywordExtractor {
  constructor();
  extractKeywords(text: string, topN?: number): string[];
}
```

**Example:**
```typescript
import { KeywordExtractor } from "textanalysis-tool";

const extractor = new KeywordExtractor();
const keywords = extractor.extractKeywords(
  "Machine learning algorithms process data efficiently",
  5
);
console.log(keywords); // ["machine", "learning", "algorithms", "process", "data"]
```

---

#### `TextDiff`

Compare two texts and identify differences.
```typescript
class TextDiff {
  compare(text1: string, text2: string): TextDiffResult;
}
```

**Example:**
```typescript
import { TextDiff } from "textanalysis-tool";

const diff = new TextDiff();
const result = diff.compare("I love cats", "I love dogs");
console.log(result.similarity);              // 75.0
console.log(result.wordDifference.added);    // ["dogs"]
console.log(result.wordDifference.removed);  // ["cats"]
```

---

#### `LexiconLoader`

Service for loading linguistic resources (stopwords and IDF maps).
```typescript
class LexiconLoader {
  static async loadStopWords(): Promise<Set<string>>;
  static async loadStandardIDF(): Promise<Map<string, number>>;
}
```

**Example:**
```typescript
import { LexiconLoader } from "textanalysis-tool";

// Load resources manually if needed
const stopWords = await LexiconLoader.loadStopWords();
const idfMap = await LexiconLoader.loadStandardIDF();
```

---

### 🎯 Operations Enum

All built-in operations available in the library.
```typescript
enum Operations {
  // Text Removal
  RemovePunctuations = "removepunc",
  RemoveNumbers = "removenum",
  RemoveAlphabets = "removealpha",
  RemoveSpecialChars = "removespecialchar",
  RemoveNewlines = "newlineremover",
  RemoveExtraSpaces = "extraspaceremover",
  
  // Text Extraction
  ExtractUrls = "extractUrls",
  ExtractEmails = "extractEmails",
  ExtractPhoneNumbers = "extractPhoneNumbers",
  ExtractHashtags = "extractHashtags",
  ExtractMentions = "extractMentions",
  ExtractKeywords = "extractKeywords",
  
  // Text Transformation
  ConvertToUppercase = "fullcaps",
  ConvertToLowercase = "lowercaps",
  ConvertToTitleCase = "titlecase",
  ReverseText = "reversetext",
  Truncate = "truncate",
  
  // Text Counting
  CountCharacters = "charcount",
  CountAlphabets = "alphacount",
  CountNumbers = "numcount",
  CountAlphanumeric = "alphanumericcount",
  CountWords = "wordcount",
  CountSentences = "sentencecount",
  
  // Advanced Analysis
  AnalyzeSentiment = "analyzeSentiment",
  CalculateReadability = "calculateReadability",
  DetectLanguage = "detectLanguage",
  CompareTexts = "compareTexts"
}
```

---

### ⚙️ Type Definitions

#### `AnalyserBuiltInOptions`

Configuration object for enabling operations.
```typescript
type AnalyserBuiltInOptions = Partial<Record<Operations | string, boolean | any>>;
```

**Example:**
```typescript
const options: AnalyserBuiltInOptions = {
  [Operations.CountWords]: true,
  [Operations.RemovePunctuations]: true,
  [Operations.ExtractKeywords]: { topN: 10 },
  [Operations.Truncate]: { maxLength: 100, suffix: "..." }
};
```

---

#### `TruncateConfig`

Configuration for the Truncate operation.
```typescript
interface TruncateConfig {
  maxLength: number;
  suffix?: string;  // Default: "..."
}
```

**Example:**
```typescript
const truncateConfig: TruncateConfig = {
  maxLength: 50,
  suffix: "... [read more]"
};
```

---

### 🌟 Usage Patterns

#### Pattern 1: Quick Analysis
```typescript
const analyser = await Analyser.create("Sample text", {
  [Operations.CountWords]: true
});
const result = await analyser.main();
console.log(result.metadata.counts.wordCount);
```

#### Pattern 2: Pipeline Processing
```typescript
const analyser = await Analyser.create("  MESSY TEXT!!! 123  ");

// Step 1: Clean
analyser.options = {
  [Operations.RemovePunctuations]: true,
  [Operations.RemoveExtraSpaces]: true
};
await analyser.main();

// Step 2: Transform
analyser.options = {
  [Operations.ConvertToLowercase]: true
};
const result = await analyser.main();
```

#### Pattern 3: Advanced Multi-Analysis
```typescript
const analyser = await Analyser.create(longText, {
  [Operations.AnalyzeSentiment]: true,
  [Operations.CalculateReadability]: true,
  [Operations.DetectLanguage]: true,
  [Operations.ExtractKeywords]: { topN: 10 }
});

const result = await analyser.main();
const report = {
  sentiment: result.metadata.sentiment?.classification,
  readability: result.metadata.readability?.complexity,
  language: result.metadata.languageDetection?.languageName,
  keywords: result.metadata.keywords
};
```

---

## 🤝 Contributing

Love it?  Spread the word! 🌍
1. Fork the repo 🍴
2. Create a branch `git checkout -b feature/amazing-feature` 🌿
3.  Commit your changes `git commit -m 'Add some amazing feature'` ✨
4. Push and create a PR `git push origin feature/amazing-feature` 🚀

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/abindent/textanalysis-tool/blob/master/LICENSE) file for details.