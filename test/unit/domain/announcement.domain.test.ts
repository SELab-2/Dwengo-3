import { beforeEach, describe, expect, test, vi } from 'vitest';
import {  } from '../../testObjects.json';
import { AnnouncementDomain } from '../../../server/domain/announcement.domain';

/*
// announcement persistence mock
const { mockAnnouncementPeristence } = vi.hoisted(() => {
    return {
        mockAnnouncementPeristence: {
            getLearningObjects: vi.fn(),
            createLearningObject: vi.fn(),
            updateLearningObject: vi.fn(),
            getLearningObjectById: vi.fn(),
            deleteLearningObject: vi.fn(),
        },
    };
});
vi.mock('../../../server/persistence/announcement.persistence', () => ({
    AnnouncementPersistence: vi.fn().mockImplementation(() => {
        return mockAnnouncementPeristence;
    })
}));

describe('announcement domain', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });
});
*/