---
name: component-architecture
description: "Scalable React component architecture: container vs presentation split, compound components, polymorphic asChild primitives, and error boundaries."
category: frontend
risk: safe
tags: [react, architecture, components, design-patterns, clean-code]
---

# React Component Architecture

Proven structural patterns for resilient, testable, and reusable React components.

## 1. The Compound Component Pattern

Allows complex components to share implicit state while giving consumers complete control over layout:
```tsx
export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }) {
  return <div className="tabs-list flex gap-2 border-b">{children}</div>;
};

Tabs.Trigger = function TabsTrigger({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={`px-4 py-2 ${activeTab === value ? 'border-b-2 border-primary' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

Tabs.Content = function TabsContent({ value, children }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className="tab-panel py-4">{children}</div>;
};
```

## 2. Error Boundary Containment

Wrap distinct UI modules (widgets, charts, feed items) in localized `<ErrorBoundary>` components so a failure in one section does not crash the entire application page.
