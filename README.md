# Rijalganzz Api

A modern, clean, and user-friendly interface for browsing and testing Rijal API endpoints.

![Rijal API UI Screenshot](image.png)

## Features

- 🌓 **Light/Dark Mode**: Toggle between light and dark themes with automatic preference saving
- 🔍 **Smart Search**: Quickly find endpoints by name or description
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔄 **API Status Indicators**: Visual indicators showing the status of each endpoint (ready, error, update)
- 📋 **Copy to Clipboard**: One-click copying of API endpoints and responses
- 📊 **JSON Highlighting**: Beautifully formatted JSON responses with syntax highlighting
- 📝 **Detailed Parameter Forms**: Clearly labeled input fields with tooltips for parameter descriptions

## Getting Started

### Prerequisites

- Web server (Apache, Nginx, etc.)
- Modern web browser

### Installation

1. Clone this repository to your web server:
   ```bash
   git clone https://github.com/rijalganzz
   ```

2. Configure your API endpoints in `settings.json` (see Configuration section below)

3. Access the UI through your web server (e.g., `https://rest-api-rijalganxzz.vercel.app`)

## Configuration

All API endpoints and categories are configured in the `settings.json` file. The structure is as follows:

```json
{
  "name": "Rest Api RijalGanzz",
  "version": "v1.0.0",
  "description": "Rijal Rest Api",
  "bannerImage": "/src/banner.jpg",
  "header": {
    "status": "Online!"
  },
  "apiSettings": {
    "creator": "RijalGanzz",
    "apikey": ["ELAINA MD"]
  },
  "categories": [
    {
      "name": "AI (Artificial Intelligence)",
      "items": [
        {
          "name": "LuminAI",
          "desc": "Talk with luminai",
          "path": "/ai/luminai?text=",
          "status": "ready",
          "params": {
            "text": "Text for luminai to respond to"
          }
        },
        {
          "name": "HydroMind",
          "desc": "See the list of supported AI models here: https://mind.hydrooo.web.id",
          "path": "/ai/hydromind?text=&model=",
          "status": "ready",
          "params": {
            "text": "Teks atau perintah untuk chat AI",
            "model": "1See the list of supported AI models here: https://mind.hydrooo.web.id"
          }
        }
      ]
    },
    {
      "name": "Random",
      "items": [
        {
          "name": "Blue Archive",
          "desc": "Blue Archive Random Images",
          "path": "/random/ba",
          "status": "ready"
        },
        {
          "name": "SSWeb",
          "desc": "Screenshot website from URL",
          "path": "/random/ssweb?url=",
          "status": "ready",
          "params": {
            "url": "Masukin Link Website Nya"
          }
        }
      ]
    },
    {
      "name": "Search Tools",
      "items": [
        {
          "name": "YouTube",
          "desc": "Video search",
          "path": "/search/youtube?q=",
          "status": "ready",
          "params": {
            "q": "Search query"
          }
        }
      ]
    },
    {
      "name": "Brat",
      "items": [
        {
          "name": "Brat",
          "desc": "Generate brat-style image",
          "path": "/imagecreator/brat?text=",
          "status": "ready",
          "params": {
            "text": "Masukan Text"
          }
        },
        {
          "name": "BratVid",
          "desc": "Generate brat-style video",
          "path": "/imagecreator/bratvideo?text=",
          "status": "ready",
          "params": {
            "text": "Masukan Text"
          }
        }
      ]
    }
  ]
}
```

### Adding a New Endpoint

To add a new endpoint:

1. Find the appropriate category in the `categories` array or create a new one
2. Add a new object to the `items` array with the following properties:
   - `name`: Display name of the endpoint
   - `desc`: Brief description of what the endpoint does
   - `path`: The API path, including any query parameters
   - `status`: Status of the endpoint (`"ready"`, `"error"`, or `"update"`)
   - `params`: Object containing parameter names as keys and descriptions as values

Example:
```json
{
  "name": "User Info",
  "desc": "Get user information by ID",
  "path": "/api/user?id=",
  "status": "ready",
  "params": {
    "id": "User ID number"
  }
}
```

## Customization

### Theme Colors

You can customize the colors by modifying the CSS variables in the `styles.css` file:

```css
:root {
  --primary-color: #4361ee;
  --secondary-color: #3a86ff;
  --accent-color: #4cc9f0;
  /* Additional color variables... */
}
```

### Banner Image

Change the banner image by updating the `bannerImage` property in `settings.json`:

```json
{
  "bannerImage": "/path/to/your/banner.jpg"
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Font Awesome](https://fontawesome.com/) for icons
- [Bootstrap](https://getbootstrap.com/) for layout components
- [Inter Font](https://fonts.google.com/specimen/Inter) for typography

---

Created with ❤️ by [RijalGanzz](https://github.com/rijalganzz)
