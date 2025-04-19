import React, { useState } from "react";
import logo from "../../assets/images/YODA-LOGO-removebg-preview.png";
import { useLocation } from "react-router-dom";
import { FaTshirt, FaDumbbell, FaHome, FaUsers, FaTags, FaTrademark, FaBoxOpen, FaClipboardList, FaCubes } from "react-icons/fa";
import { Bell } from "lucide-react";

const Sidebar = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:5001');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'newOrder' || data.type === 'orderUpdate') {
        const newNotification = {
          id: Date.now(),
          message: data.message,
          time: new Date(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: <FaHome /> },
    { 
      label: "Orders", 
      path: "/admin/orders", 
      icon: <FaClipboardList />,
      hasNotification: true 
    },
    { label: "Categories", path: "/admin/categories", icon: <FaTags /> },
    { label: "Brands", path: "/admin/brands", icon: <FaTrademark /> },
    {
      label: "Clothing & Accessories",
      icon: <FaTshirt />,
      subMenu: [
        { label: "Clothes", path: "/admin/clothes", icon: <FaTshirt /> },
        { label: "Accessories", path: "/admin/accessories", icon: <FaDumbbell /> },
      ],
    },
    { label: "Products", path: "/admin/products", icon: <FaBoxOpen /> },
    { label: "Packs", path: "/admin/packs", icon: <FaCubes /> },
  ];

  const isActive = (path) => location.pathname === path;
  const isSubMenuActive = (subMenu) => subMenu?.some((subItem) => isActive(subItem.path));

  return (
    <div className="w-64 bg-customDark text-white flex flex-col items-center justify-start h-screen sticky top-0 p-4">
      <a href="/">
        <img src={logo} alt="YODA Logo" className="object-cover" />
      </a>

      <ul className="flex flex-col space-y-4 mt-4 w-full">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full">
            {item.subMenu ? (
              <>
                <div
                  className={`block p-2 rounded cursor-pointer flex items-center ${
                    isSubMenuActive(item.subMenu) || showSubMenu
                      ? "bg-customBlue text-white font-bold"
                      : "hover:bg-customBlue"
                  }`}
                  onClick={() => setShowSubMenu(!showSubMenu)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </div>
                {(showSubMenu || isSubMenuActive(item.subMenu)) && (
                  <ul className="pl-6 mt-2">
                    {item.subMenu.map((subItem, subIndex) => (
                      <li key={subIndex} className="w-full">
                        <a
                          href={subItem.path}
                          className={`flex items-center p-2 rounded ${
                            isActive(subItem.path)
                              ? "bg-customBlue text-white font-bold"
                              : "hover:bg-customBlue"
                          }`}
                        >
                          <span className="mr-2">{subItem.icon}</span>
                          {subItem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="relative">
                <a
                  href={item.path}
                  className={`block p-2 rounded flex items-center justify-between ${
                    isActive(item.path) ? "bg-customBlue text-white font-bold" : "hover:bg-customBlue"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </div>
                  {item.hasNotification && unreadCount > 0 && (
                    <div 
                      className="relative cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowNotifications(!showNotifications);
                      }}
                    >
                      <Bell size={20} />
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </a>
                
                {/* Notifications Dropdown */}
                {item.hasNotification && showNotifications && (
                  <div className="absolute left-full ml-2 top-0 w-72 bg-white rounded-lg shadow-xl z-50 text-gray-800">
                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-gray-100 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="text-sm">{notification.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(notification.time).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;