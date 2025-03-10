import React from "react";

interface ListItemProps {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const List: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="m-0 p-0 flex items-center mb-10 flex-wrap">{children}</ul>
);

export const ListItem: React.FC<ListItemProps> = ({
  selected,
  onClick,
  children,
}) => (
  <li
    className={`flex flex-col items-center text-center justify-center p-5 py-5 px-7 border cursor-pointer mr-5 hover:bg-gray-200 ${
      selected ? "border-red-500" : "border-gray-300"
    }`}
    onClick={onClick}
  >
    {children}
  </li>
);

export const ListItemImage: React.FC<{ src: string }> = ({ src }) => (
  <img src={src} className="w-16 h-16 object-contain mb-5" alt="" />
);
