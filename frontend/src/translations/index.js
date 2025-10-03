export const translations = {
  zh: {
    // 通用
    common: {
      loading: '載入中...',
      save: '保存',
      cancel: '取消',
      delete: '刪除',
      edit: '編輯',
      add: '添加',
      search: '搜索',
      filter: '篩選',
      view: '查看',
      close: '關閉',
      confirm: '確認',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      submit: '提交',
      reset: '重置',
      yes: '是',
      no: '否',
      ok: '確定',
      error: '錯誤',
      success: '成功',
      warning: '警告',
      info: '信息',
      unknown: '未知',
      noData: '無此資料',
      itemsPerPage: '條/頁',
      total: '共 {total} 條',
      page: '第 {current} 頁，共 {total} 頁',
    },

    // 導航
    navigation: {
      home: '首頁',
      login: '登入',
      register: '註冊',
      dashboard: '個人中心',
      bookings: '預約管理',
      pets: '寵物管理',
      sitters: '保姆列表',
      sitterProfile: '個人檔案',
      posts: '社群動態',
      logout: '登出',
      welcome: '歡迎',
    },

    // 首頁
    home: {
      title: 'Welcome to Pet Sitting Platform',
      subtitle: 'Find the perfect professional sitter for your furry friends, so you can go out with peace of mind while your pets stay happy at home',
      registerNow: 'Register Now',
      loginAccount: 'Login Account',
      findSitter: 'Find Sitter',
      viewBookings: 'View Bookings',
      whyChooseUs: '為什麼選擇我們？',
      howToUse: '如何使用我們的服務？',
      platformStats: '平台數據',
      registeredUsers: '註冊用戶',
      professionalSitters: '專業保姆',
      successfulBookings: '成功預約',
      averageRating: '平均評分',
      features: {
        professional: {
          title: '專業寵物保姆',
          description: '經過認證的專業保姆，為您的寵物提供最優質的照顧服務'
        },
        safe: {
          title: '安全可靠',
          description: '所有保姆都經過背景調查，確保您的寵物安全無虞'
        },
        service: {
          title: '24/7 服務',
          description: '隨時為您提供預約服務，滿足您的各種時間需求'
        },
        personalized: {
          title: '個人化服務',
          description: '根據您的寵物特性和需求，提供量身定制的照顧方案'
        }
      },
      steps: {
        step1: {
          title: '1. 註冊帳號',
          description: '簡單註冊，填寫基本資料和寵物資訊'
        },
        step2: {
          title: '2. 尋找保姆',
          description: '瀏覽保姆資料，查看評價和服務內容'
        },
        step3: {
          title: '3. 預約服務',
          description: '選擇時間和服務，完成預約付款'
        }
      }
    },

    // 認證
    auth: {
      login: {
        title: '歡迎回來',
        subtitle: '請登入您的帳號',
        email: '電子郵件',
        password: '密碼',
        loginButton: '登入',
        noAccount: '還沒有帳號？',
        registerNow: 'Register Now',
        emailRequired: '請輸入電子郵件！',
        emailInvalid: '請輸入有效的電子郵件格式！',
        passwordRequired: '請輸入密碼！',
        passwordMinLength: '密碼至少需要 6 個字符！',
        loginSuccess: '登入成功！',
        loginFailed: '登入失敗，請稍後再試',
        userNotFound: '使用者不存在',
        wrongPassword: '密碼錯誤'
      },
      register: {
        title: '加入我們',
        subtitle: '創建您的帳號開始使用',
        name: '姓名',
        email: '電子郵件',
        password: '密碼',
        confirmPassword: '確認密碼',
        role: '角色',
        petOwner: '寵物主人',
        petSitter: '寵物保姆',
        registerButton: '註冊',
        hasAccount: '已有帳號？',
        loginNow: '立即登入',
        nameRequired: '請輸入姓名！',
        nameMinLength: '姓名至少需要 2 個字符！',
        emailRequired: '請輸入電子郵件！',
        emailInvalid: '請輸入有效的電子郵件格式！',
        passwordRequired: '請輸入密碼！',
        passwordMinLength: '密碼至少需要 6 個字符！',
        confirmPasswordRequired: '請確認密碼！',
        passwordMismatch: '兩次輸入的密碼不一致！',
        roleRequired: '請選擇角色！',
        registerSuccess: '註冊成功！請登入您的帳號',
        registerFailed: '註冊失敗，請稍後再試',
        emailExists: 'Email 已被註冊'
      }
    },

    // 個人中心
    dashboard: {
      title: '🏠 個人中心',
      userInfo: {
        petOwner: '寵物主人',
        petSitter: '寵物保姆'
      },
      stats: {
        totalBookings: '總預約數',
        petCount: '寵物數量',
        availableBookings: '可接預約',
        completedBookings: '完成預約'
      },
      status: {
        pending: '待處理',
        accepted: '已接受',
        rejected: '已拒絕',
        completed: '已完成'
      },
      recentBookings: {
        title: '最近預約',
        viewAll: '查看全部',
        booking: '預約',
        pet: '寵物',
        time: '時間',
        noBookings: '暫無預約記錄'
      },
      myPets: {
        title: '我的寵物',
        manage: '管理寵物',
        type: '類型',
        age: '年齡',
        years: '歲',
        noPets: '暫無寵物記錄'
      },
      availableBookings: {
        title: '可接的預約',
        viewAll: '查看全部',
        booking: '預約',
        pet: '寵物',
        owner: '寵物主人',
        noBookings: '暫無可接的預約'
      },
      quickActions: {
        title: '快速操作',
        findSitter: 'Find Sitter',
        findPets: '尋找需要寄養的寵物',
        viewBookings: 'View Bookings',
        managePets: '管理寵物',
        manageProfile: '管理個人資料'
      },
      avatar: {
        title: '上傳頭像',
        upload: '上傳照片',
        uploadSuccess: '頭像上傳成功！',
        uploadFailed: '頭像上傳失敗',
        imageOnly: '只能上傳圖片文件！',
        imageSize: '圖片大小不能超過 3MB！',
        tips: '建議上傳正方形圖片，大小不超過 3MB'
      },
      status: {
        pending: '待處理',
        accepted: '已接受',
        rejected: '已拒絕',
        completed: '已完成'
      }
    },

    // 預約管理
    bookings: {
      title: '預約管理',
      addBooking: '新增預約',
      bookingId: '預約編號',
      pet: '寵物',
      petOwner: '寵物主人',
      sitter: '保姆',
      startTime: '開始時間',
      endTime: '結束時間',
      status: '狀態',
      actions: '操作',
      view: '查看',
      accept: '接受',
      reject: '拒絕',
      createBooking: '創建預約',
      bookingDetails: '預約詳情',
      notes: '備註',
      statuses: {
        pending: '待處理',
        accepted: '已接受',
        rejected: '已拒絕',
        completed: '已完成'
      },
      form: {
        selectPet: '選擇寵物',
        selectSitter: '選擇保姆',
        startDate: '開始時間',
        endDate: '結束時間',
        selectStartDate: '請選擇開始時間',
        selectEndDate: '請選擇結束時間',
        petRequired: '請選擇寵物！',
        sitterRequired: '請選擇保姆！',
        startDateRequired: '請選擇開始時間！',
        endDateRequired: '請選擇結束時間！'
      },
      messages: {
        createSuccess: '預約創建成功！',
        createFailed: '創建預約失敗',
        acceptSuccess: '已接受預約',
        rejectSuccess: '已拒絕預約',
        operationFailed: '操作失敗',
        fetchFailed: '獲取數據失敗'
      }
    },

    // 保姆列表
    sitters: {
      title: '👥 保姆列表',
      searchPlaceholder: '搜索保姆姓名或描述...',
      filterByType: '按類型篩選',
      allTypes: '所有類型',
      noResults: '沒有找到符合條件的保姆',
      noResultsSubtitle: '請嘗試調整搜索條件或篩選器',
      fetchFailed: '獲取保姆數據失敗',
      types: {
        dog: '狗',
        cat: '貓',
        bird: '鳥',
        fish: '魚',
        rabbit: '兔子',
        hamster: '倉鼠',
        other: '其他'
      }
    },

    // 寵物管理
    pets: {
      title: '寵物管理',
      addPet: '添加寵物',
      petName: '寵物名稱',
      type: '類型',
      age: '年齡',
      breed: '品種',
      weight: '體重',
      description: '描述',
      image: '寵物照片',
      uploadImage: '上傳照片',
      editPet: '編輯寵物',
      deletePet: '刪除寵物',
      confirmDelete: '確認刪除',
      deleteConfirmText: '確定要刪除寵物 "{name}" 嗎？',
      types: {
        dog: '狗',
        cat: '貓',
        bird: '鳥',
        fish: '魚',
        rabbit: '兔子',
        hamster: '倉鼠',
        other: '其他'
      },
      form: {
        nameRequired: '請輸入寵物名稱！',
        nameLength: '名稱長度應在 1-20 個字符之間！',
        typeRequired: '請選擇寵物類型！',
        ageRequired: '請輸入年齡！',
        breedRequired: '請輸入品種！',
        age: '歲',
        weightUnit: 'kg',
        descriptionPlaceholder: '請輸入寵物描述（可選）'
      },
      messages: {
        addSuccess: '寵物添加成功！',
        addFailed: '添加寵物失敗',
        updateSuccess: '寵物信息更新成功！',
        updateFailed: '更新寵物信息失敗',
        deleteSuccess: '寵物刪除成功！',
        deleteFailed: '刪除寵物失敗',
        fetchFailed: '獲取寵物數據失敗',
        uploadSuccess: '圖片上傳成功！',
        uploadFailed: '圖片上傳失敗'
      }
    },

    // 保姆列表
    sitters: {
      title: '👥 保姆列表',
      searchPlaceholder: '搜索保姆姓名或描述...',
      filterByType: '篩選寵物類型',
      allTypes: '所有類型',
      bookService: '預約服務',
      specialties: '專長',
      experience: '經驗',
      years: '年',
      hourlyRate: '時薪',
      location: '位置',
      noResults: '沒有找到符合條件的保姆',
      noResultsSubtitle: '請嘗試調整搜索條件或篩選器',
      fetchFailed: '獲取保姆數據失敗',
      defaultDescription: '專業的寵物保姆，提供優質的照顧服務',
      types: {
        dog: '狗',
        cat: '貓',
        bird: '鳥',
        fish: '魚',
        rabbit: '兔子',
        hamster: '倉鼠',
        other: '其他'
      }
    },

    // 保姆檔案頁面
    sitterProfile: {
      backToList: '返回保姆列表',
      loading: '載入中...',
      notFound: '找不到此保姆資料',
      rating: '分',
      serviceSpecialties: '服務專長',
      serviceDetails: '服務詳情',
      dailyRate: '每日收費',
      serviceArea: '服務地區',
      availableDates: '可用時間',
      photoDisplay: '照片展示',
      contactInfo: '聯絡資訊',
      bookNow: '立即預約',
      sendMessage: '發送訊息',
      userReviews: '用戶評價',
      noReviews: '暫無評價',
      unknownUser: '未知用戶',
      fetchFailed: '獲取保姆資料失敗',
      contactComingSoon: '聯絡功能即將開放！'
    },

    // 保姆編輯頁面
    sitterEdit: {
      backToDashboard: '返回儀表板',
      editProfile: '編輯個人資料',
      basicInfo: '基本資料',
      photoDisplay: '照片展示',
      preview: '預覽',
      personalBio: '個人簡介',
      bioRequired: '請輸入個人簡介',
      bioPlaceholder: '請介紹您的經驗、專長和服務理念...',
      serviceSpecialties: '服務專長',
      specialtiesRequired: '請選擇至少一項服務專長',
      specialtiesPlaceholder: '選擇您能照顧的寵物類型',
      dailyRate: '每日收費 (NZD$)',
      location: '服務地區',
      locationPlaceholder: '例如：Hamilton Central',
      personalPhoto: '個人照片',
      uploadPhoto: '上傳照片',
      onlyImages: '只能上傳圖片檔案！',
      imageSizeLimit: '圖片大小不能超過 5MB！',
      cancel: '取消',
      saveChanges: '儲存變更',
      loginRequired: '請先登入',
      sitterOnly: '只有保姆才能編輯個人資料',
      fetchFailed: '獲取保姆資料失敗',
      updateSuccess: '個人資料更新成功！',
      createSuccess: '個人資料創建成功！',
      saveFailed: '保存失敗，請重試',
      uploadSuccess: '圖片上傳成功',
      uploadFailed: '圖片上傳失敗',
      uploadError: '未知錯誤',
      defaultBio: '請輸入個人簡介...',
      defaultSpecialties: '請選擇服務專長...',
      defaultLocation: '請輸入服務地區...',
      petTypes: {
        dog: '狗',
        cat: '🐱 貓',
        bird: '🐦 鳥',
        fish: '🐠 魚',
        rabbit: '🐰 兔子',
        hamster: '🐹 倉鼠',
        other: '其他'
      }
    },

    // 貼文
    posts: {
      title: '📱 社群動態',
      createPost: '發布貼文',
      editPost: '編輯貼文',
      content: '內容',
      images: '圖片',
      petType: '寵物類型',
      location: '地點',
      tags: '標籤',
      share: '分享',
      addComment: '添加留言...',
      publish: '發布',
      types: {
        dog: '狗',
        cat: '貓',
        bird: '鳥',
        fish: '魚',
        rabbit: '兔子',
        hamster: '倉鼠',
        other: '其他'
      },
      form: {
        contentRequired: '請輸入貼文內容！',
        contentPlaceholder: '分享您的寵物故事...',
        locationPlaceholder: '例如：台北市信義區',
        tagsPlaceholder: '用逗號分隔，例如：可愛,狗狗,散步',
        imageOnly: '只能上傳圖片檔案！',
        imageSize: '圖片大小不能超過 5MB！'
      },
      messages: {
        createSuccess: '貼文發布成功！',
        createFailed: '發布貼文失敗',
        fetchFailed: '獲取貼文失敗',
        likeFailed: '操作失敗',
        commentFailed: '留言失敗',
        deleteCommentFailed: '刪除留言失敗',
        deleteSuccess: '貼文已刪除',
        deleteFailed: '刪除貼文失敗'
      },
      confirmDelete: '確定要刪除這篇貼文嗎？',
      upload: '上傳圖片',
      selectPetType: '選擇寵物類型'
    },

    // 頁腳
    footer: {
      copyright: '寵物保姆平台 ©2024 Created with ❤️'
    }
  },

  en: {
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search',
      filter: 'Filter',
      view: 'View',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      reset: 'Reset',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Info',
      unknown: 'Unknown',
      noData: 'No data',
      itemsPerPage: 'items/page',
      total: 'Total {total} items',
      page: 'Page {current} of {total}',
    },

    // Navigation
    navigation: {
      home: 'Home',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      pets: 'Pets',
      sitters: 'Sitters',
      sitterProfile: 'My Profile',
      posts: 'Community',
      logout: 'Logout',
      welcome: 'Welcome',
    },

    // Home
    home: {
      title: 'Welcome to Pet Sitting Platform',
      subtitle: 'Find the perfect professional pet sitter for your furry friends, so you can travel with peace of mind',
      registerNow: 'Register Now',
      loginAccount: 'Login',
      findSitter: 'Find Sitter',
      viewBookings: 'View Bookings',
      whyChooseUs: 'Why Choose Us?',
      howToUse: 'How to Use Our Service?',
      platformStats: 'Platform Statistics',
      registeredUsers: 'Registered Users',
      professionalSitters: 'Professional Sitters',
      successfulBookings: 'Successful Bookings',
      averageRating: 'Average Rating',
      features: {
        professional: {
          title: 'Professional Pet Sitters',
          description: 'Certified professional sitters providing the highest quality care for your pets'
        },
        safe: {
          title: 'Safe & Reliable',
          description: 'All sitters undergo background checks to ensure your pets\' safety'
        },
        service: {
          title: '24/7 Service',
          description: 'Available anytime for booking services to meet your various time needs'
        },
        personalized: {
          title: 'Personalized Service',
          description: 'Tailored care plans based on your pet\'s characteristics and needs'
        }
      },
      steps: {
        step1: {
          title: '1. Register Account',
          description: 'Simple registration, fill in basic information and pet details'
        },
        step2: {
          title: '2. Find Sitter',
          description: 'Browse sitter profiles, check reviews and service content'
        },
        step3: {
          title: '3. Book Service',
          description: 'Choose time and service, complete booking and payment'
        }
      }
    },

    // Auth
    auth: {
      login: {
        title: 'Welcome Back',
        subtitle: 'Please login to your account',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        noAccount: 'Don\'t have an account?',
        registerNow: 'Register Now',
        emailRequired: 'Please enter your email!',
        emailInvalid: 'Please enter a valid email format!',
        passwordRequired: 'Please enter your password!',
        passwordMinLength: 'Password must be at least 6 characters!',
        loginSuccess: 'Login successful!',
        loginFailed: 'Login failed, please try again later',
        userNotFound: 'User not found',
        wrongPassword: 'Wrong password'
      },
      register: {
        title: 'Join Us',
        subtitle: 'Create your account to get started',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        role: 'Role',
        petOwner: 'Pet Owner',
        petSitter: 'Pet Sitter',
        registerButton: 'Register',
        hasAccount: 'Already have an account?',
        loginNow: 'Login Now',
        nameRequired: 'Please enter your name!',
        nameMinLength: 'Name must be at least 2 characters!',
        emailRequired: 'Please enter your email!',
        emailInvalid: 'Please enter a valid email format!',
        passwordRequired: 'Please enter your password!',
        passwordMinLength: 'Password must be at least 6 characters!',
        confirmPasswordRequired: 'Please confirm your password!',
        passwordMismatch: 'The two passwords do not match!',
        roleRequired: 'Please select a role!',
        registerSuccess: 'Registration successful! Please login to your account',
        registerFailed: 'Registration failed, please try again later',
        emailExists: 'Email already registered'
      }
    },

    // Dashboard
    dashboard: {
      title: '🏠 Dashboard',
      userInfo: {
        petOwner: 'Pet Owner',
        petSitter: 'Pet Sitter'
      },
      stats: {
        totalBookings: 'Total Bookings',
        petCount: 'Pet Count',
        availableBookings: 'Available Bookings',
        completedBookings: 'Completed Bookings'
      },
      status: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        completed: 'Completed'
      },
      recentBookings: {
        title: 'Recent Bookings',
        viewAll: 'View All',
        booking: 'Booking',
        pet: 'Pet',
        time: 'Time',
        noBookings: 'No booking records'
      },
      myPets: {
        title: 'My Pets',
        manage: 'Manage Pets',
        type: 'Type',
        age: 'Age',
        years: 'years',
        noPets: 'No pet records'
      },
      availableBookings: {
        title: 'Available Bookings',
        viewAll: 'View All',
        booking: 'Booking',
        pet: 'Pet',
        owner: 'Pet Owner',
        noBookings: 'No available bookings'
      },
      quickActions: {
        title: 'Quick Actions',
        findSitter: 'Find Sitter',
        findPets: 'Find Pets Needing Care',
        viewBookings: 'View Bookings',
        managePets: 'Manage Pets',
        manageProfile: 'Manage Profile'
      },
      avatar: {
        title: 'Upload Avatar',
        upload: 'Upload Photo',
        uploadSuccess: 'Avatar uploaded successfully!',
        uploadFailed: 'Avatar upload failed',
        imageOnly: 'Only image files are allowed!',
        imageSize: 'Image size must be less than 3MB!',
        tips: 'Recommended: square image, less than 3MB'
      },
      status: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        completed: 'Completed'
      }
    },

    // Bookings
    bookings: {
      title: 'Booking Management',
      addBooking: 'Add Booking',
      bookingId: 'Booking ID',
      pet: 'Pet',
      petOwner: 'Pet Owner',
      sitter: 'Sitter',
      startTime: 'Start Time',
      endTime: 'End Time',
      status: 'Status',
      actions: 'Actions',
      view: 'View',
      accept: 'Accept',
      reject: 'Reject',
      createBooking: 'Create Booking',
      bookingDetails: 'Booking Details',
      notes: 'Notes',
      statuses: {
        pending: 'Pending',
        accepted: 'Accepted',
        rejected: 'Rejected',
        completed: 'Completed'
      },
      form: {
        selectPet: 'Select Pet',
        selectSitter: 'Select Sitter',
        startDate: 'Start Date',
        endDate: 'End Date',
        selectStartDate: 'Please select start date',
        selectEndDate: 'Please select end date',
        petRequired: 'Please select a pet!',
        sitterRequired: 'Please select a sitter!',
        startDateRequired: 'Please select start date!',
        endDateRequired: 'Please select end date!'
      },
      messages: {
        createSuccess: 'Booking created successfully!',
        createFailed: 'Failed to create booking',
        acceptSuccess: 'Booking accepted',
        rejectSuccess: 'Booking rejected',
        operationFailed: 'Operation failed',
        fetchFailed: 'Failed to fetch data'
      }
    },

    // Sitters
    sitters: {
      title: '👥 Sitter List',
      searchPlaceholder: 'Search sitter name or description...',
      filterByType: 'Filter by type',
      allTypes: 'All Types',
      noResults: 'No sitters found matching your criteria',
      noResultsSubtitle: 'Try adjusting your search terms or filters',
      fetchFailed: 'Failed to fetch sitter data',
      types: {
        dog: 'Dog',
        cat: 'Cat',
        bird: 'Bird',
        fish: 'Fish',
        rabbit: 'Rabbit',
        hamster: 'Hamster',
        other: 'Other'
      }
    },

    // Pets
    pets: {
      title: 'Pet Management',
      addPet: 'Add Pet',
      petName: 'Pet Name',
      type: 'Type',
      age: 'Age',
      breed: 'Breed',
      weight: 'Weight',
      description: 'Description',
      image: 'Pet Photo',
      uploadImage: 'Upload Photo',
      editPet: 'Edit Pet',
      deletePet: 'Delete Pet',
      confirmDelete: 'Confirm Delete',
      deleteConfirmText: 'Are you sure you want to delete pet "{name}"?',
      types: {
        dog: 'Dog',
        cat: 'Cat',
        bird: 'Bird',
        fish: 'Fish',
        rabbit: 'Rabbit',
        hamster: 'Hamster',
        other: 'Other'
      },
      form: {
        nameRequired: 'Please enter pet name!',
        nameLength: 'Name length should be between 1-20 characters!',
        typeRequired: 'Please select pet type!',
        ageRequired: 'Please enter age!',
        breedRequired: 'Please enter breed!',
        age: 'years',
        weightUnit: 'kg',
        descriptionPlaceholder: 'Please enter pet description (optional)'
      },
      messages: {
        addSuccess: 'Pet added successfully!',
        addFailed: 'Failed to add pet',
        updateSuccess: 'Pet information updated successfully!',
        updateFailed: 'Failed to update pet information',
        deleteSuccess: 'Pet deleted successfully!',
        deleteFailed: 'Failed to delete pet',
        fetchFailed: 'Failed to fetch pet data',
        uploadSuccess: 'Image uploaded successfully!',
        uploadFailed: 'Failed to upload image'
      }
    },

    // Sitters
    sitters: {
      title: '👥 Sitter List',
      searchPlaceholder: 'Search sitter name or description...',
      filterByType: 'Filter by pet type',
      allTypes: 'All Types',
      bookService: 'Book Service',
      specialties: 'Specialties',
      experience: 'Experience',
      years: 'years',
      hourlyRate: 'Hourly Rate',
      location: 'Location',
      noResults: 'No sitters found matching criteria',
      noResultsSubtitle: 'Please try adjusting search criteria or filters',
      fetchFailed: 'Failed to fetch sitter data',
      defaultDescription: 'Professional pet sitter providing quality care services',
      types: {
        dog: 'Dog',
        cat: 'Cat',
        bird: 'Bird',
        fish: 'Fish',
        rabbit: 'Rabbit',
        hamster: 'Hamster',
        other: 'Other'
      }
    },

    // Sitter Profile Page
    sitterProfile: {
      backToList: 'Back to Sitter List',
      loading: 'Loading...',
      notFound: 'Sitter profile not found',
      rating: 'points',
      serviceSpecialties: 'Service Specialties',
      serviceDetails: 'Service Details',
      dailyRate: 'Daily Rate',
      serviceArea: 'Service Area',
      availableDates: 'Available Dates',
      photoDisplay: 'Photo Display',
      contactInfo: 'Contact Information',
      bookNow: 'Book Now',
      sendMessage: 'Send Message',
      userReviews: 'User Reviews',
      noReviews: 'No reviews yet',
      unknownUser: 'Unknown User',
      fetchFailed: 'Failed to fetch sitter profile',
      contactComingSoon: 'Contact feature coming soon!'
    },

    // Sitter Edit Page
    sitterEdit: {
      backToDashboard: 'Back to Dashboard',
      editProfile: 'Edit Personal Profile',
      basicInfo: 'Basic Information',
      photoDisplay: 'Photo Display',
      preview: 'Preview',
      personalBio: 'Personal Bio',
      bioRequired: 'Please enter personal bio',
      bioPlaceholder: 'Please introduce your experience, specialties and service philosophy...',
      serviceSpecialties: 'Service Specialties',
      specialtiesRequired: 'Please select at least one service specialty',
      specialtiesPlaceholder: 'Select pet types you can care for',
      dailyRate: 'Daily Rate (NZD$)',
      location: 'Service Area',
      locationPlaceholder: 'e.g.: Hamilton Central',
      personalPhoto: 'Personal Photo',
      uploadPhoto: 'Upload Photo',
      onlyImages: 'Only image files allowed!',
      imageSizeLimit: 'Image size cannot exceed 5MB!',
      cancel: 'Cancel',
      saveChanges: 'Save Changes',
      loginRequired: 'Please login first',
      sitterOnly: 'Only sitters can edit personal profile',
      fetchFailed: 'Failed to fetch sitter data',
      updateSuccess: 'Personal profile updated successfully!',
      createSuccess: 'Personal profile created successfully!',
      saveFailed: 'Save failed, please try again',
      uploadSuccess: 'Image uploaded successfully',
      uploadFailed: 'Image upload failed',
      uploadError: 'Unknown error',
      defaultBio: 'Please enter personal bio...',
      defaultSpecialties: 'Please select service specialties...',
      defaultLocation: 'Please enter service area...',
      petTypes: {
        dog: 'Dog',
        cat: '🐱 Cat',
        bird: '🐦 Bird',
        fish: '🐠 Fish',
        rabbit: '🐰 Rabbit',
        hamster: '🐹 Hamster',
        other: 'Other'
      }
    },

    // Posts
    posts: {
      title: '📱 Community',
      createPost: 'Create Post',
      editPost: 'Edit Post',
      content: 'Content',
      images: 'Images',
      petType: 'Pet Type',
      location: 'Location',
      tags: 'Tags',
      share: 'Share',
      addComment: 'Add a comment...',
      publish: 'Publish',
      types: {
        dog: 'Dog',
        cat: 'Cat',
        bird: 'Bird',
        fish: 'Fish',
        rabbit: 'Rabbit',
        hamster: 'Hamster',
        other: 'Other'
      },
      form: {
        contentRequired: 'Please enter post content!',
        contentPlaceholder: 'Share your pet story...',
        locationPlaceholder: 'e.g., Xinyi District, Taipei',
        tagsPlaceholder: 'Separate with commas, e.g., cute,dog,walk',
        imageOnly: 'Only image files are allowed!',
        imageSize: 'Image size must be less than 5MB!'
      },
      messages: {
        createSuccess: 'Post published successfully!',
        createFailed: 'Failed to publish post',
        fetchFailed: 'Failed to fetch posts',
        likeFailed: 'Operation failed',
        commentFailed: 'Failed to comment',
        deleteCommentFailed: 'Failed to delete comment',
        deleteSuccess: 'Post deleted successfully',
        deleteFailed: 'Failed to delete post'
      },
      confirmDelete: 'Are you sure you want to delete this post?',
      upload: 'Upload Image',
      selectPetType: 'Select Pet Type'
    },

    // Footer
    footer: {
      copyright: 'Pet Sitting Platform ©2024 Created with ❤️'
    }
  }
};

