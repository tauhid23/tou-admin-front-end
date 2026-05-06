/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        
        secondary: "var(--secondary)",
        "secondary-hover": "var(--secondary-hover)",
        
        accent: "var(--accent)",          
        "accent-soft": "var(--accent-soft)",
        
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        sidebar: "var(--sidebar)",
        card: "var(--card)",
        
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        
        border: "var(--border)",
        input: "var(--input)",
        
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
    },
  },
  plugins: [],
};