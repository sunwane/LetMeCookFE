import { AccountItem, sampleAccounts } from './AccountItem';
import { RecipeItem, foodData } from './RecipeItem';

export interface NotificationItem {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'recipe_approved' | 'recipe_rejected' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender?: AccountItem; // Người gửi thông báo (nếu có)
  recipe?: RecipeItem; // Món ăn liên quan (nếu có)
  actionUrl?: string; // Link để chuyển đến khi tap vào thông báo
}

export const sampleNotifications: NotificationItem[] = [
  {
    id: 1,
    type: 'like',
    title: 'Có người thích bình luận của bạn',
    message: 'BếpTrưởngTậpSự đã thích bình luận của bạn về món Bánh Mì Ram Ram',
    isRead: false,
    createdAt: '2024-12-20T10:30:00Z',
    sender: sampleAccounts[0],
    recipe: foodData[0],
    actionUrl: '/recipe/1/comments'
  },
  {
    id: 2,
    type: 'comment',
    title: 'Bình luận mới',
    message: 'ĐầuBếpNhíNhố đã bình luận về công thức Phở Bò của bạn',
    isRead: false,
    createdAt: '2024-12-20T09:15:00Z',
    sender: sampleAccounts[1],
    recipe: foodData[1],
    actionUrl: '/recipe/2/comments'
  },
  {
    id: 3,
    type: 'follow',
    title: 'Người theo dõi mới',
    message: 'ChefAnNa đã bắt đầu theo dõi bạn',
    isRead: true,
    createdAt: '2024-12-20T08:45:00Z',
    sender: sampleAccounts[2],
    actionUrl: '/profile/3'
  },
  {
    id: 4,
    type: 'recipe_approved',
    title: 'Công thức được duyệt',
    message: 'Công thức "Mì Ý công thức Jollibee" của bạn đã được phê duyệt và xuất bản',
    isRead: true,
    createdAt: '2024-12-19T16:20:00Z',
    recipe: foodData[2],
    actionUrl: '/recipe/3'
  },
  {
    id: 5,
    type: 'like',
    title: 'Có người thích công thức',
    message: 'MasterCook99 và 5 người khác đã thích công thức Mì xào giòn của bạn',
    isRead: true,
    createdAt: '2024-12-19T14:30:00Z',
    sender: sampleAccounts[3],
    recipe: foodData[3],
    actionUrl: '/recipe/4'
  },
  {
    id: 6,
    type: 'comment',
    title: 'Bình luận mới',
    message: 'FoodieQueen đã hỏi về cách làm trong công thức Bò né của bạn',
    isRead: false,
    createdAt: '2024-12-19T12:15:00Z',
    sender: sampleAccounts[4],
    recipe: foodData[4],
    actionUrl: '/recipe/5/comments'
  },
  {
    id: 7,
    type: 'system',
    title: 'Cập nhật ứng dụng',
    message: 'Phiên bản mới đã có sẵn với nhiều tính năng thú vị. Hãy cập nhật ngay!',
    isRead: false,
    createdAt: '2024-12-19T10:00:00Z',
    actionUrl: '/update'
  },
  {
    id: 8,
    type: 'recipe_rejected',
    title: 'Công thức cần chỉnh sửa',
    message: 'Công thức "Lẩu nấm chay" cần bổ sung thêm hình ảnh và chi tiết các bước làm',
    isRead: true,
    createdAt: '2024-12-18T15:45:00Z',
    recipe: foodData[7],
    actionUrl: '/recipe/8/edit'
  },
  {
    id: 9,
    type: 'follow',
    title: 'Người theo dõi mới',
    message: 'CookingKing đã bắt đầu theo dõi bạn',
    isRead: false,
    createdAt: '2024-12-18T13:20:00Z',
    sender: sampleAccounts[5],
    actionUrl: '/profile/6'
  },
  {
    id: 10,
    type: 'like',
    title: 'Thành tích mới',
    message: 'Chúc mừng! Công thức Cơm tấm sườn bì chả của bạn đã đạt 200 lượt thích',
    isRead: true,
    createdAt: '2024-12-18T11:30:00Z',
    recipe: foodData[8],
    actionUrl: '/recipe/9'
  },
  {
    id: 11,
    type: 'comment',
    title: 'Phản hồi từ đầu bếp',
    message: 'SpiceGirl đã trả lời câu hỏi của bạn về công thức Cơm chiên hải sản',
    isRead: false,
    createdAt: '2024-12-17T16:45:00Z',
    sender: sampleAccounts[6],
    recipe: foodData[6],
    actionUrl: '/recipe/7/comments'
  },
  {
    id: 12,
    type: 'system',
    title: 'Mẹo nấu ăn hôm nay',
    message: 'Bạn có biết: Thêm một chút muối vào nước khi luộc rau để giữ màu xanh tự nhiên?',
    isRead: true,
    createdAt: '2024-12-17T09:00:00Z',
    actionUrl: '/tips'
  },
  {
    id: 13,
    type: 'like',
    title: 'Bình luận được yêu thích',
    message: 'FlavorMaster và 3 người khác đã thích bình luận của bạn',
    isRead: false,
    createdAt: '2024-12-16T20:15:00Z',
    sender: sampleAccounts[7],
    recipe: foodData[5],
    actionUrl: '/recipe/6/comments'
  },
  {
    id: 14,
    type: 'follow',
    title: 'Gợi ý theo dõi',
    message: 'HomeChef có nhiều công thức hay. Hãy theo dõi để không bỏ lỡ!',
    isRead: true,
    createdAt: '2024-12-16T18:30:00Z',
    sender: sampleAccounts[8],
    actionUrl: '/profile/9'
  },
  {
    id: 15,
    type: 'recipe_approved',
    title: 'Công thức nổi bật',
    message: 'Công thức Mì bò Đài Loan của bạn đã được chọn làm công thức nổi bật tuần này!',
    isRead: false,
    createdAt: '2024-12-16T14:00:00Z',
    recipe: foodData[5],
    actionUrl: '/featured-recipes'
  }
];

// Helper functions
export const getUnreadNotificationsCount = (): number => {
  return sampleNotifications.filter(notification => !notification.isRead).length;
};

export const markNotificationAsRead = (notificationId: number): void => {
  const notification = sampleNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
};

export const markAllNotificationsAsRead = (): void => {
  sampleNotifications.forEach(notification => {
    notification.isRead = true;
  });
};

export const getNotificationsByType = (type: NotificationItem['type']): NotificationItem[] => {
  return sampleNotifications.filter(notification => notification.type === type);
};

export const getRecentNotifications = (limit: number = 5): NotificationItem[] => {
  return sampleNotifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};