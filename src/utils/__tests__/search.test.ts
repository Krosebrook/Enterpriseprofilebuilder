import { describe, it, expect } from 'vitest';
import { searchContent, highlightText, extractSnippet } from '../search';

describe('Search Utilities', () => {
  describe('searchContent', () => {
    it('should return empty array for empty query', () => {
      expect(searchContent('')).toEqual([]);
      expect(searchContent('  ')).toEqual([]);
    });

    it('should return empty array for query less than 2 characters', () => {
      expect(searchContent('a')).toEqual([]);
    });

    it('should search and return results', () => {
      const results = searchContent('claude');
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should include section information in results', () => {
      const results = searchContent('search');
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('section');
        expect(results[0]).toHaveProperty('title');
        expect(results[0]).toHaveProperty('content');
        expect(results[0]).toHaveProperty('relevance');
      }
    });

    it('should sort results by relevance', () => {
      const results = searchContent('ai');
      if (results.length > 1) {
        for (let i = 0; i < results.length - 1; i++) {
          expect(results[i].relevance).toBeGreaterThanOrEqual(results[i + 1].relevance);
        }
      }
    });

    it('should be case insensitive', () => {
      const resultsLower = searchContent('claude');
      const resultsUpper = searchContent('CLAUDE');
      const resultsMixed = searchContent('Claude');
      
      expect(resultsLower.length).toBeGreaterThan(0);
      expect(resultsLower.length).toBe(resultsUpper.length);
      expect(resultsLower.length).toBe(resultsMixed.length);
    });
  });

  describe('highlightText', () => {
    it('should return original text for empty query', () => {
      const text = 'Hello world';
      expect(highlightText(text, '')).toBe(text);
    });

    it('should highlight matching text', () => {
      const text = 'Hello world';
      const result = highlightText(text, 'world');
      expect(result).toContain('<mark>world</mark>');
    });

    it('should be case insensitive', () => {
      const text = 'Hello World';
      const result = highlightText(text, 'world');
      expect(result).toContain('<mark>World</mark>');
    });

    it('should highlight multiple occurrences', () => {
      const text = 'test test test';
      const result = highlightText(text, 'test');
      expect((result.match(/<mark>test<\/mark>/gi) || []).length).toBe(3);
    });
  });

  describe('extractSnippet', () => {
    it('should extract snippet from start if query not found', () => {
      const content = 'This is a long text that should be truncated at 200 characters or so.';
      const snippet = extractSnippet(content, 'notfound', 50);
      expect(snippet.length).toBeLessThanOrEqual(53); // 50 + '...'
    });

    it('should extract snippet around query', () => {
      const content = 'Start of text. This is the QUERY we are looking for. End of text.';
      const snippet = extractSnippet(content, 'QUERY', 20);
      expect(snippet).toContain('QUERY');
    });

    it('should add ellipsis when truncating', () => {
      const content = 'A'.repeat(500);
      const snippet = extractSnippet(content, 'notfound', 100);
      expect(snippet.endsWith('...')).toBe(true);
    });

    it('should handle query at start of content', () => {
      const content = 'QUERY at the start of a long text';
      const snippet = extractSnippet(content, 'QUERY', 20);
      expect(snippet).toContain('QUERY');
      expect(snippet.startsWith('...')).toBe(false);
    });

    it('should handle query at end of content', () => {
      const content = 'A long text with QUERY at the end';
      const snippet = extractSnippet(content, 'QUERY', 20);
      expect(snippet).toContain('QUERY');
    });
  });
});
