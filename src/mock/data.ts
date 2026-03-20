export interface VideoAsset {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  uploader: string;
  status: 'pending' | 'approved' | 'rejected';
  fileSize: number;
  uploadTime: string;
  city: string;
  tags: string[];
  duration: number;
}

export const mockAssets: VideoAsset[] = [
  {
    id: '1',
    title: 'Alpine_Aerial_Master_v2.mov',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: '陈志明',
    status: 'approved',
    fileSize: 1.2 * 1024 * 1024 * 1024,
    uploadTime: '2023-10-24T14:32:00Z',
    city: '北京',
    tags: ['航拍', '自然', '4K'],
    duration: 262,
  },
  {
    id: '2',
    title: 'Cyberpunk_City_Lights_4K.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: '李华',
    status: 'pending',
    fileSize: 856 * 1024 * 1024,
    uploadTime: '2023-10-23T09:15:00Z',
    city: '上海',
    tags: ['夜景', '城市', '赛博朋克'],
    duration: 135,
  },
  {
    id: '3',
    title: 'Wildlife_Documentary_Elephant.raw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: '王强',
    status: 'approved',
    fileSize: 4.2 * 1024 * 1024 * 1024,
    uploadTime: '2023-10-22T16:40:00Z',
    city: '广州',
    tags: ['野生动物', '纪录片', 'RAW'],
    duration: 760,
  },
  {
    id: '4',
    title: 'Glacier_Meltdown_Final.mov',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518182170546-0766de6b6aa1?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: '张美',
    status: 'rejected',
    fileSize: 2.1 * 1024 * 1024 * 1024,
    uploadTime: '2023-10-21T11:08:00Z',
    city: '深圳',
    tags: ['自然', '冰川', '环保'],
    duration: 368,
  },
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `mock-${i + 5}`,
    title: `Generic_B_Roll_Shot_${i + 5}.mp4`,
    thumbnailUrl: `https://picsum.photos/seed/video${i + 5}/800/450`,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    uploader: ['陈志明', '李华', '王强', '张美'][i % 4],
    status: ['approved', 'pending', 'rejected'][i % 3] as any,
    fileSize: (0.5 + Math.random() * 5) * 1024 * 1024 * 1024,
    uploadTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
    city: ['北京', '上海', '广州', '深圳', '杭州'][i % 5],
    tags: ['B-Roll', '素材', '通用'],
    duration: Math.floor(Math.random() * 600) + 10,
  })),
];
