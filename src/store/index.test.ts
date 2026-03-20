import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './index';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useAppStore.setState({
      activeTab: 'assets',
      searchQuery: '',
      fieldPreferences: {
        title: true,
        uploader: true,
        city: true,
        tags: true,
        duration: true,
        uploadTime: true,
        fileSize: true,
      },
    });
  });

  it('should have initial state', () => {
    const state = useAppStore.getState();
    expect(state.activeTab).toBe('assets');
    expect(state.searchQuery).toBe('');
    expect(state.fieldPreferences.title).toBe(true);
  });

  it('should update activeTab', () => {
    useAppStore.getState().setActiveTab('dashboard');
    expect(useAppStore.getState().activeTab).toBe('dashboard');
  });

  it('should update searchQuery', () => {
    useAppStore.getState().setSearchQuery('test query');
    expect(useAppStore.getState().searchQuery).toBe('test query');
  });

  it('should toggle field preferences', () => {
    // Initially true
    expect(useAppStore.getState().fieldPreferences.uploader).toBe(true);
    
    // Toggle to false
    useAppStore.getState().toggleFieldPreference('uploader');
    expect(useAppStore.getState().fieldPreferences.uploader).toBe(false);
    
    // Toggle back to true
    useAppStore.getState().toggleFieldPreference('uploader');
    expect(useAppStore.getState().fieldPreferences.uploader).toBe(true);
  });
});
