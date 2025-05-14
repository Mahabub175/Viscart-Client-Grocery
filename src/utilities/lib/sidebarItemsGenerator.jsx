import React from "react";
import Link from "next/link";
import scrollToTop from "./scrollToTop";

export const sidebarItemsGenerator = (items, pathname, role) => {
  return items.map((item) => {
    if (item.children) {
      return {
        key: item.name,
        icon: null,
        label: (
          <div className="flex items-center gap-2">
            {React.createElement(item.icon, { className: "text-lg" })}
            <span className="text-sm font-semibold">{item.name}</span>
          </div>
        ),
        children: item.children.map((child) => ({
          key: child.name,
          icon: null,
          label: (
            <Link
              href={`/${role}/${child.path}`}
              onClick={scrollToTop}
              className={`flex items-center gap-2 hover:text-primary font-semibold text-sm ${
                pathname === `/${role}/${child.path}` ? "text-primary" : ""
              }`}
            >
              {React.createElement(child.icon, { className: "text-lg" })}
              {child.name}
            </Link>
          ),
        })),
      };
    }

    return {
      key: item.name,
      icon: null,
      label: (
        <Link
          href={`/${role}/${item.path}`}
          onClick={scrollToTop}
          className={`flex items-center gap-2 hover:text-primary font-semibold text-sm ${
            pathname === `/${role}/${item.path}` ? "text-primary" : ""
          }`}
        >
          {React.createElement(item.icon, { className: "text-lg" })}
          {item.name}
        </Link>
      ),
    };
  });
};
