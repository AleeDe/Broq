// API endpoint mappings for Spring Boot backend
export const API_ROUTES = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REFRESH_TOKEN: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  
  // Users
  USER_PROFILE: '/api/users/current-user',
  USER_ALL: '/api/admin/users/all',
  
  // Bookings
  BOOKINGS: '/api/bookings',
  MY_ROOM_BOOKINGS: '/api/bookings/my',
  
  // Food
  FOOD: '/api/public/all/foods',
  FOOD_ORDERS: '/api/food-orders',
  MY_FOORD_ORDERS: '/api/food-orders',
  
  // Activities
  ACTIVITIES: '/api/public/all/activities',
  ACTIVITY_BOOKINGS: '/api/activities/booking/create',
  
  // Rooms
  ROOMS: '/api/public/all/rooms',
  ROOM_BOOK: '/api/rooms/book',
  
  // Admin
  ADMIN_FOODSCREATE: '/api/admin/food/create',
  ADMIN_FOODSEDITE: '/api/admin/food',
  ADMIN_FOODSDELETE: '/api/admin/food',


  ADMIN_ROOMS_CREATE: '/api/admin/rooms',
  ADMIN_ROOMS_EDIT: '/api/admin/rooms',
  ADMIN_ROOMS_DELETE: '/api/admin/rooms',


  ADMIN_ACTIVITIES_CREATE: '/api/admin/activity/create',
  ADMIN_ACTIVITIES_EDIT: '/api/admin/activity',
  ADMIN_ACTIVITIES_DELETE: '/api/admin/activity',

  ADMIN_BOOKINGS: '/api/admin/bookings',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_BLOGS: '/api/admin/blogs',
};
