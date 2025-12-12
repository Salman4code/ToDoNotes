"use client";

const Sidebar = () => {
  const items = [
    { label: "Notes", icon: "💡" },
    { label: "Reminders", icon: "🔔" },
    { label: "Edit labels", icon: "✏️" },
    { label: "Archive", icon: "📥" },
    { label: "Trash", icon: "🗑️" },
  ];

  return (
    <nav className="p-4">
      <ul className="space-y-4">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-3 text-gray-700 hover:text-black cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">{it.icon}</div>
            <span className="hidden md:inline">{it.label}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
