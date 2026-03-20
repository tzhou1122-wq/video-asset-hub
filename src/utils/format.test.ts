import { describe, it, expect } from 'vitest';
import { formatBytes, formatDuration } from './format';

describe('formatBytes', () => {
  it('should format 0 bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
  });

  it('should format bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 Bytes');
  });

  it('should format KB correctly', () => {
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
  });

  it('should format MB correctly', () => {
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1572864)).toBe('1.5 MB');
  });

  it('should format GB correctly', () => {
    expect(formatBytes(1073741824)).toBe('1 GB');
  });
});

describe('formatDuration', () => {
  it('should format seconds correctly', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(45)).toBe('00:45');
  });

  it('should format minutes and seconds correctly', () => {
    expect(formatDuration(60)).toBe('01:00');
    expect(formatDuration(125)).toBe('02:05');
    expect(formatDuration(3599)).toBe('59:59');
  });

  it('should handle hours as minutes', () => {
    expect(formatDuration(3600)).toBe('60:00');
    expect(formatDuration(7205)).toBe('120:05');
  });
});
