# 🌟 Text Analysis Tools 🌟

[![npm version](https://img.shields.io/npm/v/textanalysis-tool.svg)](https://www.npmjs.com/package/textanalysis-tool)  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)  [![TypeScript](https://img.shields.io/badge/%3C/%3E-TypeScript-blue)](https://www.typescriptlang.org/)

> 🚀 A lightning-fast ⚡ TypeScript library for 🤖 text analysis and 🔧 manipulation.  Bundled with everything from simple cleanup to deep linguistic insights!  📦

---
## 🗂️ Table of Contents
- [🌟 Text Analysis Tools 🌟](#-text-analysis-tools-)
  - [🗂️ Table of Contents](#️-table-of-contents)
  - [⬇️ Installation](#️-installation)
  - [🧩 Usage](#-usage)
    - [🔰 Basic Usage](#-basic-usage)
    - [⚙️ Working with Operations](#️-working-with-operations)
    - [🧠 Advanced Analysis](#-advanced-analysis)
    - [🏭 Using Factory Methods](#-using-factory-methods)
    - [📦 Batch Processing](#-batch-processing)
  - [🛠️ Available Operations](#️-available-operations)
    - [🗑️ Text Removal](#️-text-removal)
    - [📤 Text Extraction](#-text-extraction)
    - [🔄 Text Transformation](#-text-transformation)
    - [🔢 Text Counting](#-text-counting)
    - [🔮 Advanced Analysis Options](#-advanced-analysis-options)
  - [🎨 Custom Operations](#-custom-operations)
    - [➕ Adding Custom Operations](#-adding-custom-operations)
    - [📊 With Metadata Extraction](#-with-metadata-extraction)
  - [🚀 Advanced Usage](#-advanced-usage)
    - [🔘 Toggling Operations](#-toggling-operations)
    - [🔀 Managing Multiple Operations](#-managing-multiple-operations)
    - [🔄 Resetting Text](#-resetting-text)
    - [✂️ Truncating Text](#️-truncating-text)
  - [🔬 Direct Use of Analytical Extensions](#-direct-use-of-analytical-extensions)
    - [😊 SentimentAnalyzer – Deep Dive](#-sentimentanalyzer--deep-dive)
    - [📊 CalculateReadability – Complete Guide](#-calculatereadability--complete-guide)
    - [🔄 CompareTexts – Text Comparison & Diff](#-comparetexts--text-comparison--diff)
    - [🌐 Language Detection](#-language-detection)
    - [🎯 Combined Analysis Example](#-combined-analysis-example)
  - [📘 API Reference](#-api-reference)
    - [🧰 Tools. Analyser Class](#-toolsanalyser-class)
    - [🧩 Tools.Operations Enum](#-toolsoperations-enum)
    - [🔍 Tools. ToolsConstant Class](#-toolstoolsconstant-class)
    - [📋 Interface Types](#-interface-types)
    - [🔌 Extensions](#-extensions)
  - [😊 SentimentAnalyzer](#-sentimentanalyzer)
  - [📊 TextStatistics](#-textstatistics)
  - [🌐 LanguageDetector](#-languagedetector)
  - [🔍 TextDiff](#-textdiff)
  - [🧩 Interfaces & Types](#-interfaces--types)
    - [😀 SentimentResult](#-sentimentresult)
    - [🏷️ SentimentClassification](#️-sentimentclassification)
    - [📖 ReadabilityResult](#-readabilityresult)
    - [🗣️ LanguageDetectionResult](#️-languagedetectionresult)
    - [🔄 TextDiffResult](#-textdiffresult)
  - [🤝 Contributing](#-contributing)
  - [📝 License](#-license)

---
## ⬇️ Installation

> _Install in one click!  ✨_

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

### 🔰 Basic Usage

```typescript
import { Tools } from 'textanalysis-tool';

const text = "This is a sample text with 123 numbers and https://example.com URL! ";

// Create analyzer using factory method
const analyser = new Tools.Analyser(text, {
  [Tools.Operations.CountCharacters]: true,
  [Tools.Operations. CountWords]: true,
  [Tools.Operations.ExtractUrls]: true
});

// Run the analysis
analyser.main()
  .then(result => {
    console.log("Text analysis results:");
    console.log(`- Character count: ${result.metadata.counts.characterCount}`);
    console.log(`- Word count: ${result. metadata.counts.wordCount}`);
    console.log(`- URLs found: ${result.metadata.urls?. join(', ')}`);
    console.log(`- Operations performed: ${result.operations.join(', ')}`);
    console.log(`- Execution time: ${result.executionTime}ms`);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
  });
```

### ⚙️ Working with Operations

```typescript
import { Tools } from 'textanalysis-tool';

const analyser = new Tools.Analyser("Hello, world!  123 #hashtag @mention", {
  // Enable specific operations
  [Tools.Operations. RemovePunctuations]: true,
  [Tools. Operations.RemoveNumbers]: true,
  [Tools. Operations.ConvertToUppercase]: true
});

analyser.main(). then(result => {
  console.log(result. output);  // "HELLO WORLD HASHTAG MENTION"
});
```

### 🧠 Advanced Analysis

```typescript
import { Tools } from 'textanalysis-tool';

const paragraph = `This tool is amazing 🎯.  Sometimes you need exact control. `;

const analyser = new Tools.Analyser(paragraph, {
  [Tools.Operations. AnalyzeSentiment]: true,
  [Tools.Operations.CalculateReadability]: true,
  [Tools.Operations.DetectLanguage]: true,
  [Tools.Operations.CompareTexts]: { compareWith: 'Other example text.' }
});

analyser.main().then(result => {
  console.log('❤️ Sentiment:', result. metadata.sentiment);
  console.log('📖 Readability:', result.metadata.readability);
  console. log('🌍 Language:', result.metadata.languageDetection);
  console.log('🔍 Text Diff:', result.metadata.textComparison);
});
```

### 🏭 Using Factory Methods

```typescript
import { Tools } from 'textanalysis-tool';

// Create an analyzer with specific operations enabled
const analyser = Tools.Analyser.createWithEnabledOperations(
  "Hello, world! 123",
  ['CountCharacters', 'CountWords', 'RemovePunctuations']
);

analyser.main().then(result => {
  console.log(result.output);  // "Hello world 123"
  console.log(`Words: ${result.metadata.counts. wordCount}`);
  console.log(`Characters: ${result.metadata.counts. characterCount}`);
});
```

### 📦 Batch Processing

```typescript
import { Tools } from 'textanalysis-tool';

const texts = [
  "First sample with https://example1.com",
  "Second sample 12345 with #hashtags",
  "Third sample with @mentions and emails@example.com"
];

const options = {
  [Tools.Operations.CountWords]: true,
  [Tools.Operations.ExtractUrls]: true,
  [Tools.Operations.ExtractHashtags]: true,
  [Tools.Operations.ExtractMentions]: true,
  [Tools.Operations.ExtractEmails]: true
};

Tools.Analyser.batch(texts, options)
  .then(results => {
    results.forEach((result, index) => {
      console.log(`\nAnalysis of text #${index + 1}:`);
      console.log(`- Word count: ${result.metadata.counts.wordCount}`);
      console.log(`- URLs: ${result.metadata.urls?. join(', ') || 'None'}`);
      console.log(`- Hashtags: ${result.metadata. hashtags?. join(', ') || 'None'}`);
      console. log(`- Mentions: ${result.metadata.mentions?.join(', ') || 'None'}`);
      console.log(`- Emails: ${result.metadata. emails?.join(', ') || 'None'}`);
    });
  });
```

## 🛠️ Available Operations

### 🗑️ Text Removal

| Operation             | Description                | Example Input       | Example Output    |
| --------------------- | -------------------------- | ------------------- | ----------------- |
| `RemovePunctuations`  | 🧹 Remove punctuation      | "Hello, world!"    | "Hello world"    |
| `RemoveNumbers`       | 🔢 Remove numbers         | "abc123def"        | "abcdef"         |
| `RemoveAlphabets`     | 🔡 Remove alphabets       | "abc123def"        | "123"            |
| `RemoveSpecialChars`  | ✨ Remove special chars    | "Hi @you #1!"      | "Hi you 1"       |
| `RemoveNewlines`      | ↩️ Remove newlines         | "Hello\nWorld"    | "Hello World"    |
| `RemoveExtraSpaces`   | 📏 Trim extra spaces       | "  Hi   there  "   | "Hi there"       |

### 📤 Text Extraction

| Operation              | Description              | Example Input                        | Example Output            |
| ---------------------- | ------------------------ | ------------------------------------ | ------------------------- |
| `ExtractUrls`          | 🌐 Extract URLs          | "Visit https://a.com and b.org"    | ["https://a.com"]       |
| `ExtractEmails`        | ✉️ Extract emails        | "Email me at user@test.com"        | ["user@test.com"]       |
| `ExtractPhoneNumbers`  | 📞 Extract phone numbers | "Call 123-456-7890"                | ["123-456-7890"]        |
| `ExtractHashtags`      | #️⃣ Extract hashtags     | "#fun #code"                       | ["#fun","#code"]      |
| `ExtractMentions`      | @️⃣ Extract mentions     | "Hi @user!"                        | ["@user"]               |
| `ExtractKeywords`      | 🔑 Extract keywords (TF-IDF) | "The quick brown fox" | ["quick", "brown", "fox"] |

### 🔄 Text Transformation

| Operation             | Description             | Example Input          | Example Output   |
| --------------------- | ----------------------- | ---------------------- | ---------------- |
| `ConvertToUppercase`  | 🔠 UPPERCASE conversion | "Hello World"         | "HELLO WORLD"   |
| `ConvertToLowercase`  | 🔡 lowercase conversion | "Hello World"         | "hello world"   |
| `ConvertToTitleCase`  | 🆎 Title Case           | "hello world"         | "Hello World"   |
| `ReverseText`         | 🔁 Reverse text         | "abcde"               | "edcba"         |
| `Truncate`            | ✂️ Truncate text        | (maxLength=5) "abcdef"| "abcde..."      |

### 🔢 Text Counting

| Operation              | Description              | Example Input | Example Output      |
| ---------------------- | ------------------------ | ------------- | ------------------- |
| `CountCharacters`      | 🔠 Count non-space chars | "Hi!"        | 3                   |
| `CountAlphabets`       | 📝 Count letters         | "A1b2C"      | 3                   |
| `CountNumbers`         | 🔢 Count digits         | "A1b2C"      | 2                   |
| `CountAlphanumeric`    | 🔤 Letters+digits count  | "A1 b2!"     | { alph:3, num:2 }   |
| `CountWords`           | 📝 Count words           | "Hello world"| 2                   |
| `CountSentences`       | 📑 Count sentences       | "Hi.  Bye?"   | 2                   |

### 🔮 Advanced Analysis Options

| Operation               | Description                      | Example Input                       | Example Output                  |
| ----------------------- | -------------------------------- | ------------------------------------ | ------------------------------- |
| `AnalyzeSentiment`      | ❤️ Sentiment analysis (Ensemble) | "I love this!"                    | { score:0.8, classification:"positive" }|
| `CalculateReadability`  | 📖 Flesch-Kincaid & SMOG scores | "The quick brown fox jumps..."    | { readabilityScore:70, gradeLevel:5, smogIndex:7 }           |
| `DetectLanguage`        | 🌍 Language detection           | "Bonjour le monde"                | { detectedLanguage:"french", confidence:0.9 }           |
| `CompareTexts`          | 🔍 Text diff & similarity       | { compareWith: "other text" }     | { similarity:45. 5, wordDifference:{... } }  |
| `ExtractKeywords`       | 🔑 TF-IDF keyword extraction    | "machine learning algorithms"     | ["machine", "learning", "algorithms"] |

---

## 🎨 Custom Operations

_Easily plug in your own workflows!  ✨_

### ➕ Adding Custom Operations

You can extend functionality by adding your own custom operations:

```typescript
import { Tools } from 'textanalysis-tool';

const analyser = new Tools.Analyser("Sample text for custom operation");

// Add a simple custom operation
await analyser.addCustomOperation(
  "surroundWithAsterisks", // Command name
  "Surround With Asterisks", // Log name
  {
    operation: (text) => `*${text}*`, // Operation function
    isEnabled: true, // Enable immediately
    metadata: { decorationType: "asterisks" } // Additional metadata
  }
);

// Run the analysis with the custom operation
const result = await analyser.main();
console.log(result.output); // "*Sample text for custom operation*"
console.log(result.metadata.custom?.surroundWithAsterisks); // { decorationType: "asterisks" }
```

### 📊 With Metadata Extraction

```typescript
import { Tools } from 'textanalysis-tool';

const analyser = new Tools.Analyser("The code is 12345 and the pin is 6789");

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
        codeCount: allNumbers.length
      };
    }
  }
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
import { Tools } from 'textanalysis-tool';

const analyser = new Tools.Analyser("Sample text with 123 numbers");

// Enable specific operations
await analyser.toggleOperation(Tools.Operations.RemoveNumbers, true);
await analyser.toggleOperation(Tools.Operations.CountCharacters, true);

// Run analysis
let result = await analyser.main();
console.log(result.output); // "Sample text with  numbers"

// Disable and enable different operations
await analyser.toggleOperation(Tools.Operations.RemoveNumbers, false);
await analyser. toggleOperation(Tools.Operations.ConvertToUppercase, true);

// Run analysis again with new settings
result = await analyser. main();
console.log(result.output); // "SAMPLE TEXT WITH 123 NUMBERS"
```

### 🔀 Managing Multiple Operations

```typescript
import { Tools } from 'textanalysis-tool';

const analyser = new Tools.Analyser("Hello, world! 123");

// Enable all available operations
await analyser.enableAllOperations();

// Run with all operations
let result = await analyser.main();
console.log("With all operations:", result.output);

// Disable all operations
await analyser.disableAllOperations();

// Enable only specific operations using enum keys
await analyser.toggleOperation(Tools.Operations.RemovePunctuations, true);
await analyser.toggleOperation(Tools.Operations.ConvertToUppercase, true);

// Run with only selected operations
result = await analyser. main();
console.log("With selected operations:", result.output); // "HELLO WORLD 123"
```

### 🔄 Resetting Text

```typescript
import { Tools } from 'textanalysis-tool';

const analyser = new Tools. Analyser("Original text", {
  [Tools.Operations.ConvertToUppercase]: true
});

// Run first analysis
let result = await analyser.main();
console.log(result.output); // "ORIGINAL TEXT"

// Reset with new text
await analyser.resetText("New content");

// Run analysis again
result = await analyser. main();
console.log(result.output); // "NEW CONTENT"
```

### ✂️ Truncating Text

```typescript
import { Tools } from 'textanalysis-tool';

const longText = "This is a very long text that needs to be truncated to a reasonable length. ";

const analyser = new Tools.Analyser(longText, {
  [Tools. Operations.Truncate]: {
    maxLength: 20,
    suffix: "..." // Optional, defaults to "..."
  }
});

analyser.main().then(result => {
  console.log(result.output); // "This is a very long..."
});
```

---

## 🔬 Direct Use of Analytical Extensions

You can use advanced analytical components directly (outside of `Tools.Analyser`) for specialized workflows:

### 😊 SentimentAnalyzer – Deep Dive

```typescript
import { SentimentAnalyzer } from 'textanalysis-tool/dist/extensions';

const sentimentAnalyzer = new SentimentAnalyzer();

// Example 1: Positive Text
const positiveResult = sentimentAnalyzer.analyze(
  "I absolutely love this amazing tool! It's fantastic and incredible!"
);
console.log("Positive Analysis:");
console.log(`Score: ${positiveResult.score}`);              // ~0.8 to 1.0
console.log(`Classification: ${positiveResult.classification}`); // "positive"
console.log(`Positive Words: ${positiveResult.positiveWordCount}`);
console.log(`Negative Words: ${positiveResult.negativeWordCount}`);
console.log(`Total Words: ${positiveResult.totalWords}`);

// Example 2: Negative Text
const negativeResult = sentimentAnalyzer.analyze(
  "This is terrible, awful, and the worst experience ever."
);
console.log("\nNegative Analysis:");
console. log(`Score: ${negativeResult.score}`);              // ~-0.8 to -1.0
console.log(`Classification: ${negativeResult.classification}`); // "negative"

// Example 3: Neutral Text
const neutralResult = sentimentAnalyzer.analyze(
  "The weather today is cloudy."
);
console.log("\nNeutral Analysis:");
console. log(`Score: ${neutralResult.score}`);               // ~-0.1 to 0.1
console.log(`Classification: ${neutralResult.classification}`); // "neutral"

// Example 4: Mixed Sentiment
const mixedResult = sentimentAnalyzer.analyze(
  "The product is good but the delivery was terrible."
);
console. log("\nMixed Sentiment Analysis:");
console.log(`Score: ${mixedResult.score}`);
console.log(`Classification: ${mixedResult.classification}`);
console.log(`Positive Words: ${mixedResult.positiveWordCount}`);
console.log(`Negative Words: ${mixedResult.negativeWordCount}`);
```

**Output Example:**
```
Positive Analysis:
  Score: 0.85
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
import { TextStatistics } from 'textanalysis-tool/dist/extensions';

const textStats = new TextStatistics();

// Example 1: Simple Text (High Readability)
const simpleText = "The cat sat on the mat.  It was happy.";
const simpleReadability = textStats.fleschKincaidReadability(simpleText);
console.log("Simple Text Analysis:");
console.log(`Readability Score: ${simpleReadability.readabilityScore}`);     // ~85-90
console.log(`Grade Level: ${simpleReadability. gradeLevel}`);                 // ~1-2
console.log(`SMOG Index: ${simpleReadability.smogIndex}`);                   // ~1-2
console.log(`Complexity: ${simpleReadability.complexity}`);                  // "Very Easy"
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
console.log(`Readability Score: ${complexReadability.readabilityScore}`);    // ~25-35
console.log(`Grade Level: ${complexReadability.gradeLevel}`);               // ~14-16 (College level)
console.log(`Complexity: ${complexReadability.complexity}`);                // "Very Difficult"

// Example 3: News Article (Medium Readability)
const newsText = `
  The technology sector continues to evolve rapidly.  Artificial intelligence 
  is transforming businesses worldwide. Companies are investing significantly 
  in machine learning infrastructure. 
`;
const newsReadability = textStats.fleschKincaidReadability(newsText);
console.log("\nNews Article Analysis:");
console.log(`Readability Score: ${newsReadability. readabilityScore}`);      // ~50-60
console.log(`Grade Level: ${newsReadability. gradeLevel}`);                 // ~8-10
console.log(`Complexity: ${newsReadability.complexity}`);                  // "Fairly Difficult"
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
import { TextDiff } from 'textanalysis-tool/dist/extensions';

const textDiff = new TextDiff();

// Example 1: Simple Comparison
const text1 = "I love cats and dogs";
const text2 = "I love cats and birds";

const diff1 = textDiff.compare(text1, text2);
console.log("Simple Text Comparison:");
console.log(`Similarity: ${diff1.similarity. toFixed(2)}%`);               // ~80%
console.log(`Added Words: ${diff1.wordDifference. added. join(', ')}`);    // "birds"
console.log(`Removed Words: ${diff1.wordDifference.removed.join(', ')}`); // "dogs"
console.log(`Unchanged Words: ${diff1.wordDifference.unchangedCount}`);  // 4

// Example 2: Code Comparison
const originalCode = "const x = 10; const y = 20; console.log(x + y);";
const modifiedCode = "const x = 10; const y = 30; console.log(x + y);";

const diff2 = textDiff.compare(originalCode, modifiedCode);
console. log("\nCode Comparison:");
console.log(`Similarity: ${diff2.similarity. toFixed(2)}%`);
console.log(`Changes Detected:`);
console.log(`+ Added: ${diff2.wordDifference.added.join(', ') || 'None'}`);
console.log(`- Removed: ${diff2.wordDifference.removed.join(', ') || 'None'}`);

// Example 3: Document Versioning
const v1 = "The project timeline extends to Q3 2024 with multiple milestones";
const v2 = "The project timeline extends to Q4 2024 with several key milestones";

const diff3 = textDiff.compare(v1, v2);
console.log("\nDocument Version Comparison:");
console.log(`Similarity Ratio: ${(diff3.similarity / 100). toFixed(2)} (0. 0-1.0)`);
console.log(`Word Statistics:`);
console.log(`+ Total Added: ${diff3.wordDifference.addedCount}`);
console.log(`- Total Removed: ${diff3.wordDifference. removedCount}`);
console. log(`- Unchanged: ${diff3.wordDifference.unchangedCount}`);

// Example 4: Full Diff Output
const before = "apple banana cherry date";
const after = "apple blueberry cherry fig";

const fullDiff = textDiff.compare(before, after);
console. log("\nFull Difference Report:");
console.log(`+ Added: [${fullDiff.wordDifference.added.join(', ')}]`);
console.log(`- Removed: [${fullDiff.wordDifference. removed.join(', ')}]`);
console.log(`Unchanged: [${fullDiff. wordDifference.unchanged.join(', ')}]`);
console.log(`Overall Similarity: ${fullDiff.similarity.toFixed(1)}%`);
```

---

### 🌐 Language Detection

```typescript
import { LanguageDetector } from 'textanalysis-tool/dist/extensions';

const detector = new LanguageDetector();

// Example 1: English Detection
const englishText = "Hello, how are you today?  This is a beautiful day.";
const engResult = detector.detect(englishText);
console.log("English Detection:");
console.log(`Detected Language: ${engResult.detectedLanguage}`);           // "english"
console.log(`Confidence: ${(engResult.confidence * 100). toFixed(1)}%`);   // ~90%
console.log(`Language Scores: ${JSON.stringify(engResult.scores)}`);

// Example 2: French Detection
const frenchText = "Bonjour, comment allez-vous?  C'est une belle journée.";
const frResult = detector.detect(frenchText);
console.log("\nFrench Detection:");
console.log(`Detected Language: ${frResult.detectedLanguage}`);
console.log(`Confidence: ${(frResult.confidence * 100).toFixed(1)}%`);

// Example 3: Spanish Detection
const spanishText = "Hola, ¿cómo estás? Este es un hermoso día.";
const esResult = detector.detect(spanishText);
console.log("\nSpanish Detection:");
console. log(`Detected Language: ${esResult.detectedLanguage}`);
console.log(`Confidence: ${(esResult.confidence * 100).toFixed(1)}%`);

// Example 4: German Detection
const germanText = "Hallo, wie geht es dir?  Dies ist ein wunderschöner Tag.";
const deResult = detector.detect(germanText);
console.log("\nGerman Detection:");
console.log(`Detected Language: ${deResult.detectedLanguage}`);
console.log(`Confidence: ${(deResult.confidence * 100).toFixed(1)}%`);

// Example 5: Multilingual Detection
const multilingualTexts = [
  { text: "Good morning world", lang: "English" },
  { text: "Buenos días mundo", lang: "Spanish" },
  { text: "Guten Morgen Welt", lang: "German" },
  { text: "Bonjour le monde", lang: "French" }
];

console.log("\nMultilingual Detection Results:");
multilingualTexts. forEach(item => {
  const result = detector.detect(item.text);
  console.log(`  ${item.lang}: ${result.detectedLanguage} (${(result.confidence * 100).toFixed(0)}%)`);
});
```

---

### 🎯 Combined Analysis Example

```typescript
import { Tools } from 'textanalysis-tool';
import { 
  SentimentAnalyzer, 
  TextStatistics, 
  TextDiff,
  LanguageDetector 
} from 'textanalysis-tool/dist/extensions';

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
  
  // Use Tools. Analyser for additional metrics
  const analyser = new Tools.Analyser(feedback, {
    [Tools.Operations. CountWords]: true,
    [Tools.Operations.CountSentences]: true,
    [Tools.Operations.ExtractKeywords]: { topN: 5 }
  });
  
  const toolsResult = await analyser.main();
  
  // Compile comprehensive report
  const report = {
    sentiment: {
      score: sentimentResult. score,
      classification: sentimentResult.classification,
      positiveWords: sentimentResult.positiveWordCount,
      negativeWords: sentimentResult.negativeWordCount
    },
    readability: {
      score: readabilityResult.readabilityScore,
      gradeLevel: readabilityResult. gradeLevel,
      complexity: readabilityResult.complexity,
      avgWordsPerSentence: readabilityResult.avgWordsPerSentence
    },
    language: {
      detected: languageResult.detectedLanguage,
      confidence: (languageResult.confidence * 100).toFixed(1) + '%'
    },
    content: {
      wordCount: toolsResult.metadata.counts.wordCount,
      sentenceCount: toolsResult.metadata.counts. sentenceCount,
      keywords: toolsResult.metadata.keywords
    }
  };
  
  return report;
}

// Usage
const feedback = "This product is amazing! I absolutely love the quality and support.  Highly recommended!";
analyzeCustomerFeedback(feedback).then(report => {
  console.log("Customer Feedback Analysis Report:");
  console.log(JSON.stringify(report, null, 2));
});

// Output:
// {
//   "sentiment": {
//     "score": 0.92,
//     "classification": "positive",
//     "positiveWords": 3,
//     "negativeWords": 0
//   },
//   "readability": {
//     "score": 78.5,
//     "gradeLevel": 5,
//     "complexity": "Fairly Easy",
//     "avgWordsPerSentence": 6.5
//   },
//   "language": {
//     "detected": "english",
//     "confidence": "92. 5%"
//   },
//   "content": {
//     "wordCount": 16,
//     "sentenceCount": 3,
//     "keywords": ["product", "quality", "support"]
//   }
// }
```

> **Note:**  
> These classes are accessible from `textanalysis-tool/dist/extensions`.   
> If you wish to import directly from the root, consider submitting a PR to add re-exports to `src/index.ts`.

---

## 📘 API Reference

### 🧰 Tools.Analyser Class

The main class for text analysis operations.

**Static Factory Method:**

```typescript
static async create(raw_text: string, options: AnalyserBuiltInOptions = {}): Promise<Analyser>
```
> ⚠️ Use this factory method to ensure lexicons and IDF maps are loaded before analysis.

**Constructor:**

```typescript
constructor(raw_text: string, options: AnalyserBuiltInOptions = {})
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `raw_text` | string | The input text being analyzed |
| `count` | number | The character count |
| `alphacount` | number | The alphabetic character count |
| `numericcount` | number | The numeric character count |
| `wordCount` | number | The word count |
| `sentenceCount` | number | The sentence count |
| `urls` | string[] | Extracted URLs |
| `emails` | string[] | Extracted email addresses |
| `phoneNumbers` | string[] | Extracted phone numbers |
| `hashtags` | string[] | Extracted hashtags |
| `mentions` | string[] | Extracted mentions |
| `keywords` | string[] | Extracted keywords (TF-IDF) |
| `operations` | string[] | Log of operations performed |
| `availableOperations` | Record<string, string> | All available operations |
| `options` | AnalyserBuiltInOptions | Current operation options |

**Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `main` | None | Promise<AnalyserResult> | Executes all enabled operations |
| `addCustomOperation` | commandName: string, logName: string, config: object | Promise<void> | Adds a custom operation |
| `toggleOperation` | commandName: string, isEnabled: boolean | Promise<void> | Enables/disables an operation |
| `enableAllOperations` | None | Promise<void> | Enables all operations (both enum keys and values) |
| `disableAllOperations` | None | Promise<void> | Disables all operations (both enum keys and values) |
| `resetText` | newText?: string | Promise<void> | Resets text and clears all counters |

**Static Methods:**

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| `create` | text: string, options?: AnalyserBuiltInOptions | Promise<Analyser> | Factory method that loads resources before creating instance |
| `createWithEnabledOperations` | text: string, operations: (keyof typeof Operations)[] | Analyser | Creates instance with specific operations |
| `batch` | texts: string[], options: AnalyserBuiltInOptions | Promise<AnalyserResult[]> | Processes multiple texts with same options |

### 🧩 Tools.Operations Enum

Enum of all built-in operations:

```typescript
export enum Operations {
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
  CompareTexts = "compareTexts",
}
```

### 🔍 Tools. ToolsConstant Class

Contains regular expression patterns used throughout the library:

```typescript
export class ToolsConstant {
  static readonly regex = {
    alphabets: /[a-zA-Z]/g,
    numbers: /\d/g,
    punctuations: /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g,
    specialCharacters: /[^a-zA-Z0-9\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g,
    urls: /https?:\/\/\S+/gi,
    newlines: /^\s*$(? :\r\n? |\n)/gm,
    extraSpaces: / +/g,
    character: /[^\s\p{Cf}]/gu,
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phoneNumber: /(? :\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/g,
    hashtags: /#[a-zA-Z0-9_]+/g,
    mentions: /@[a-zA-Z0-9_]+/g
  };
}
```

### 📋 Interface Types

**AnalyserBuiltInOptions:**
```typescript
type AnalyserBuiltInOptions = Partial<Record<Operations | string, boolean | any>>;
```

**AnalyserResult:**
```typescript
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
  operations: string[];
  builtInOperations: string[];
  customOperations: string[];
  executionTime?: number;
}
```

**TruncateConfig:**
```typescript
interface TruncateConfig {
  maxLength: number;
  suffix?: string;
}
```

### 🔌 Extensions

## 😊 SentimentAnalyzer

An ensemble sentiment analysis utility using Natural, Wink-NLP, and Compromise libraries.

**Constructor:**
```typescript
constructor()
```

**Methods:**

| Method             | Parameters                                             | Return Type       | Description                                      |
|--------------------|---------------------------------------------------------|-------------------|--------------------------------------------------|
| `analyze`          | `text: string`                                          | `SentimentResult` | Executes ensemble sentiment analysis on the input text    |
| `addCustomLexicon` | `lexicon: { positive?: string[]; negative?: string[] }` | `void`           | Adds custom positive/negative words (deprecated) |

---

## 📊 TextStatistics

A utility class for computing readability metrics such as the Flesch–Kincaid and SMOG scores.

**Constructor:**
```typescript
constructor()
```

**Methods:**

| Method                      | Parameters     | Return Type         | Description                                   |
|----------------------------|----------------|---------------------|-----------------------------------------------|
| `fleschKincaidReadability` | `text: string` | `ReadabilityResult` | Calculates Flesch Reading Ease, Flesch-Kincaid Grade, and SMOG Index |

---

## 🌐 LanguageDetector

An n-gram based language detection utility.  

**Constructor:**
```typescript
constructor()
```

**Methods:**

| Method               | Parameters                                    | Return Type               | Description                                    |
|----------------------|----------------------------------------------|---------------------------|------------------------------------------------|
| `detect`             | `text: string`                               | `LanguageDetectionResult` | Detects the most likely language for the text  |
| `addCustomLanguage`  | `lang: string, profile: Record<string, number>` | `void`           | Registers a new language profile               |

---

## 🔍 TextDiff

A utility class for comparing two texts and computing similarity metrics.

**Constructor:**
```typescript
constructor()
```

**Methods:**

| Method    | Parameters                      | Return Type      | Description                                             |
|-----------|--------------------------------|------------------|----------------------------------------------------------|
| `compare` | `text1: string, text2: string` | `TextDiffResult` | Computes similarity percentage and word differences |

---

## 🧩 Interfaces & Types

### 😀 SentimentResult
```typescript
interface SentimentResult {
  score: number;                                    // -1 to 1
  positiveWordCount: number;
  negativeWordCount: number;
  totalWords: number;
  classification: SentimentClassification;         // "positive", "negative", or "neutral"
}
```

### 🏷️ SentimentClassification
```typescript
type SentimentClassification = "positive" | "negative" | "neutral";
```

### 📖 ReadabilityResult
```typescript
interface ReadabilityResult {
  readabilityScore: number;     // Flesch Reading Ease (0-100)
  gradeLevel: number;           // Flesch-Kincaid Grade Level
  smogIndex: number;            // SMOG Index
  wordCount: number;
  sentenceCount: number;
  syllableCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  complexity: string;           // "Very Easy" to "Very Difficult"
}
```

### 🗣️ LanguageDetectionResult
```typescript
interface LanguageDetectionResult {
  detectedLanguage: string;
  confidence: number;           // 0 to 1
  scores: Record<string, number>;
}
```

### 🔄 TextDiffResult
```typescript
interface TextDiffResult {
  similarity: number;           // Percentage (0-100)
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