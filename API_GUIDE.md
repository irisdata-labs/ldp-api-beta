# 📖 Lunar Landing Site API - Complete Documentation

Query 1.18M pre-analyzed lunar landing sites across the lunar south pole with intelligent mission planning support.

**Base URL:** `https://lunarlandingsiteapi.up.railway.app`  
**API Version:** 1.0.0  
**Status:** Public Beta

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Data Overview](#-data-overview)
- [Authentication](#-authentication)
- [Rate Limits & Usage](#-rate-limits--usage)
- [Error Handling](#-error-handling)
- [Endpoints Overview](#endpoints-overview)
- [Status Endpoints](#status-endpoints)
- [Data Endpoints](#data-endpoints)
- [Decision Support Endpoints](#decision-support-endpoints)
- [Response Schemas](#response-schemas)
- [Best Practices](#-best-practices)
- [Code Examples](#-code-examples)
- [Data Sources & Methodology](#data-sources--methodology)
- [Support](#-support)

---

## 🚀 Quick Start

### Step 1: Get API Access

1. **Sign up** at [lunarlanding.space](https://ldp-api-beta.vercel.app) for free beta access
2. **Check your email** for your API key (starts with `ldp_live_...`)
3. **Make your first request** using the examples below

### Step 2: Your First Query (30 seconds)

Get intelligent landing site recommendations near the lunar south pole:

**Python:**
```python
import requests

API_KEY = "ldp_live_YOUR_KEY_HERE"
headers = {"X-API-Key": API_KEY}

response = requests.get(
    "https://lunarlandingsiteapi.up.railway.app/api/v1/recommendations",
    headers=headers,
    params={
        "lat": -89.5,
        "lon": 0,
        "mission_type": "artemis",
        "top_n": 5
    }
)

data = response.json()
print(data["recommendations"][0]["reasoning"])
print(f"Requests remaining: {data['user']['requests_remaining']}")
```

**JavaScript:**
```javascript
const API_KEY = "ldp_live_YOUR_KEY_HERE";

const response = await fetch(
  'https://lunarlandingsiteapi.up.railway.app/api/v1/recommendations?lat=-89.5&lon=45&mission_type=artemis&top_n=5',
  { headers: { 'X-API-Key': API_KEY } }
);

const data = await response.json();
console.log(data.recommendations[0].reasoning);
console.log(`Requests remaining: ${data.user.requests_remaining}`);
```

**cURL:**
```bash
curl -H "X-API-Key: ldp_live_YOUR_KEY_HERE" \
  "https://lunarlandingsiteapi.up.railway.app/api/v1/recommendations?lat=-89.5&lon=45&mission_type=artemis&top_n=5"
```

---

## 📊 Data Overview

This API provides access to **1.18M pre-analyzed landing sites** across the lunar south pole, derived from authoritative NASA datasets:

- **Terrain Data:** NASA LOLA (Lunar Orbiter Laser Altimeter) at 5m resolution
- **Illumination Data:** NASA LROC (Lunar Reconnaissance Orbiter Camera)
- **Coverage:** -90° to -83.5° latitude (lunar south pole region)
- **Data Quality:** 99.98% completeness (1,179,905 sites with full data)

Each site includes **60+ features** analyzed at multiple radii up to 100m radius: terrain metrics (slope, roughness, hazard index), illumination patterns (visibility percentage over lunar year), and data quality indicators.

**Why Trust This Data?**
- ✅ Built on NASA Planetary Data System (PDS) archives
- ✅ Research-grade processing pipeline with PostGIS spatial analysis
- ✅ Validated against published lunar science literature
- ✅ Same data sources used by Artemis mission planning teams

📖 [See detailed methodology](#data-sources--methodology) for complete processing pipeline, coordinate systems, and technical specifications.

---

## 🔐 Authentication

Most endpoints require an API key in the `X-API-Key` header:

```http
X-API-Key: ldp_live_YOUR_KEY_HERE
```

### Public Endpoints (No Authentication)

These endpoints are accessible without an API key:

| Endpoint | Purpose |
|----------|---------|
| `GET /` | API welcome and endpoint listing |
| `GET /health` | Health check and database status |
| `GET /docs` | Interactive Swagger documentation |
| `GET /openapi.json` | OpenAPI specification |

### Protected Endpoints (Authentication Required)

All data and decision support endpoints require a valid API key:

| Endpoint | Purpose |
|----------|---------|
| `GET /api/v1/sites/search` | Search for landing sites (optional auth for full results) |
| `POST /api/v1/sites/batch` | Bulk site retrieval |
| `GET /api/v1/recommendations` | Get AI-powered recommendations |
| `POST /api/v1/compare` | Compare multiple sites |
| All other `/api/v1/*` endpoints | Require authentication |

### API Key Management

**Where to Find Your Key:**
- Check the welcome email: "Welcome to Lunar Landing Site API - Your Access Details"
- Key format: `ldp_live_` followed by 32 alphanumeric characters
- Example: `ldp_live_6dd4063bfc6c42fb8edc942b7f4d7c1d`

**Security Best Practices:**
- ⚠️ **Never share your API key publicly** (GitHub, forums, etc.)
- ⚠️ **Never commit keys to version control**
- ✅ Use environment variables: `API_KEY = os.getenv("LUNAR_API_KEY")`
- ✅ Rotate keys if accidentally exposed

**Lost Your Key?**
1. Check your email inbox and spam folder
2. Search for emails from Lunar Landing Site API
3. Contact support: info@irisdatalabs.com

---

## 📊 Rate Limits & Usage

### Current Limits

| Tier | Daily Limit | Status |
|------|-------------|--------|
| **Beta** | 1,000 requests/day | Free during beta period |
| **Premium** | 10,000 requests/day | Coming soon |

### Monitor Your Usage

Every authenticated API response includes your current usage statistics:

```json
{
  "user": {
    "email": "your.email@example.com",
    "name": "Your Name",
    "tier": "beta",
    "requests_today": 45,
    "requests_remaining": 955,
    "rate_limit": 1000
  },
  "recommendations": [...]
}
```

### Usage Monitoring Best Practice

```python
data = response.json()
remaining = data['user']['requests_remaining']

if remaining < 100:
    print(f"⚠️ Warning: Only {remaining} requests remaining today!")
```

---

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| **200** | Success | Request completed successfully |
| **400** | Bad Request | Invalid parameters |
| **401** | Unauthorized | Missing API key |
| **403** | Forbidden | Invalid or inactive API key |
| **404** | Not Found | Resource doesn't exist |
| **422** | Validation Error | Parameter validation failed |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Server Error | Internal server error |
| **503** | Service Unavailable | Database connection failed |

### Error Response Format

```json
{
  "detail": {
    "error": "Invalid API key",
    "message": "The provided API key is not valid or has been deactivated",
    "help": "Sign up at https://ldp-api-beta.vercel.app to get a valid API key"
  }
}
```

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| Missing API key | No `X-API-Key` header | Add header to your request |
| Invalid API key | Key doesn't exist or is inactive | Check welcome email for correct key |
| Rate limit exceeded | 1,000 requests/day limit hit | Wait until tomorrow (resets at midnight UTC) |
| Invalid parameters | Coordinates out of range | Verify lat (-90 to 90), lon (-180 to 180) |
| Site not found | Invalid site_id | Use `/search` to find valid site IDs |

### Graceful Error Handling Example

```python
import requests

try:
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 401:
        print("❌ Missing API key!")
    elif e.response.status_code == 403:
        print("❌ Invalid API key!")
    elif e.response.status_code == 429:
        print("⚠️ Rate limit exceeded - try again tomorrow")
    else:
        print(f"Error {e.response.status_code}: {e.response.text}")
except Exception as e:
    print(f"Request failed: {str(e)}")
```

---

## Endpoints Overview

### Status Endpoints
- `GET /` - API information and endpoint listing
- `GET /health` - Health check and database status

### Data Endpoints
- `GET /api/v1/sites/search` - Radius-based site search with filters
- `POST /api/v1/sites/batch` - Bulk site retrieval by IDs

### Decision Support Endpoints
- `GET /api/v1/recommendations` - Mission-specific intelligent recommendations
- `POST /api/v1/compare` - Side-by-side site comparison

---

## Status Endpoints

### GET `/`

**Description:** API welcome and endpoint listing  
**Authentication:** None required

**Example:**
```bash
curl "https://lunarlandingsiteapi.up.railway.app/"
```

**Response:**
```json
{
  "message": "Lunar Landing Site API",
  "version": "1.0.0",
  "status": "operational",
  "docs": "/docs",
  "authentication": "Most endpoints require X-API-Key header",
  "signup": "https://ldp-api-beta.vercel.app",
  "endpoints": {
    "health": "/health (public)",
    "search": "/api/v1/sites/search (optional auth - better with key)",
    "batch": "/api/v1/sites/batch (requires auth)",
    "recommendations": "/api/v1/recommendations (requires auth)",
    "compare": "/api/v1/compare (requires auth)"
  }
}
```

---

### GET `/health`

**Description:** Health check and database connectivity test  
**Authentication:** None required

**Example:**
```bash
curl "https://lunarlandingsiteapi.up.railway.app/health"
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "total_sites": 1180127,
  "environment": "production"
}
```

**Error Response (503):**
```json
{
  "detail": "Database connection failed: connection refused"
}
```

---

## Data Endpoints

### GET `/api/v1/sites/search`

**Description:** Search for landing sites within a radius of target coordinates  
**Authentication:** Optional (limited to 10 results without API key, 100 with key)

**Parameters:**

| Parameter | Type | Required | Default | Range | Description |
|-----------|------|----------|---------|-------|-------------|
| `lat` | float | ✅ | - | -90 to 90 | Target latitude |
| `lon` | float | ✅ | - | -180 to 180 | Target longitude |
| `radius_m` | int | ❌ | 50000 | 1000-500000 | Search radius in meters |
| `limit` | int | ❌ | 100 | 1-100 | Max results (10 without auth, 100 with auth) |
| `min_visibility` | float | ❌ | - | 0-100 | Minimum visibility % filter |
| `max_hazard` | float | ❌ | - | 0-3 | Maximum hazard index filter |
| `max_slope` | float | ❌ | - | 0-90 | Maximum slope filter (degrees) |

**Example Request:**

```bash
curl -H "X-API-Key: ldp_live_YOUR_KEY" \
  "https://lunarlandingsiteapi.up.railway.app/api/v1/sites/search?lat=-89.5&lon=45.0&radius_m=50000&max_hazard=1.5&limit=10"
```

**Python Example:**
```python
import requests

API_KEY = "ldp_live_YOUR_KEY_HERE"
headers = {"X-API-Key": API_KEY}

response = requests.get(
    "https://lunarlandingsiteapi.up.railway.app/api/v1/sites/search",
    headers=headers,
    params={
        "lat": -89.5,
        "lon": 45.0,
        "radius_m": 50000,
        "max_hazard": 1.5,
        "min_visibility": 70.0,
        "limit": 10
    }
)

data = response.json()
print(f"Found {data['results_found']} sites")
for site in data['sites']:
    print(f"Site {site['site_id']}: Hazard {site['terrain_100m']['hazard_index']:.2f}")
```

**Response:**
```json
{
  "query": {
    "location": {"lat": -89.5, "lon": 45.0},
    "search_radius_m": 50000,
    "filters": {
      "max_hazard": 1.5,
      "min_visibility": 70.0
    }
  },
  "results_found": 10,
  "sites": [
    {
      "site_id": 928913,
      "location": {"lat": -89.947, "lon": 51.466},
      "distance_m": 5012.3,
      "terrain_100m": {
        "slope_mean_deg": 16.5,
        "slope_max_deg": 32.6,
        "slope_std_deg": 5.5,
        "hazard_index": 3.0,
        "roughness_rms_m": 9.73,
        "relief_m": 46.58,
        "elevation_mean_m": 1242.1
      },
      "illumination_100m": {
        "visibility_pct": 75.2,
        "visibility_min_pct": 61.5,
        "visibility_std_pct": 6.7
      },
      "data_quality": {
        "terrain_coverage_pct": 100.0,
        "illumination_source_res_m": 60
      }
    }
  ],
  "user": {
    "email": "you@example.com",
    "name": "Your Name",
    "tier": "beta",
    "requests_today": 46,
    "requests_remaining": 954,
    "rate_limit": 1000
  }
}
```

---

### POST `/api/v1/sites/batch`

**Description:** Retrieve multiple sites by ID in a single request  
**Authentication:** Required  
**Limit:** Maximum 100 site IDs per request

**Request Body:**
```json
{
  "site_ids": [928913, 928914, 929072]
}
```

**Example Request:**

```bash
curl -X POST https://lunarlandingsiteapi.up.railway.app/api/v1/sites/batch \
  -H "X-API-Key: ldp_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"site_ids": [928913, 928914, 929072]}'
```

**Python Example:**
```python
import requests

API_KEY = "ldp_live_YOUR_KEY_HERE"
headers = {"X-API-Key": API_KEY}

response = requests.post(
    "https://lunarlandingsiteapi.up.railway.app/api/v1/sites/batch",
    headers=headers,
    json={"site_ids": [928913, 928914, 929072]}
)

data = response.json()
print(f"Retrieved {len(data['sites'])} sites")
for site in data['sites']:
    print(f"Site {site['site_id']}: {site['location']}")
```

**Response:**
```json
{
  "sites": [
    {
      "site_id": 928913,
      "location": {"lat": -89.947, "lon": 51.466},
      "distance_m": null,
      "terrain_100m": {...},
      "illumination_100m": {...},
      "data_quality": {...}
    }
  ],
  "user": {
    "email": "you@example.com",
    "name": "Your Name",
    "tier": "beta",
    "requests_today": 47,
    "requests_remaining": 953,
    "rate_limit": 1000
  }
}
```

---

## Decision Support Endpoints

### GET `/api/v1/recommendations`

**Description:** Get AI-powered landing site recommendations with mission-specific scoring and plain English reasoning  
**Authentication:** Required

**Parameters:**

| Parameter | Type | Required | Default | Options | Description |
|-----------|------|----------|---------|---------|-------------|
| `lat` | float | ✅ | - | -90 to 90 | Target latitude |
| `lon` | float | ✅ | - | -180 to 180 | Target longitude |
| `mission_type` | string | ❌ | artemis | artemis, robotic, rover, custom | Mission profile |
| `radius_m` | int | ❌ | 50000 | 10000-500000 | Search radius in meters |
| `top_n` | int | ❌ | 5 | 1-20 | Number of recommendations |

**Mission Types:**

| Type | Description | Priorities |
|------|-------------|------------|
| `artemis` | Human landing mission - prioritizes crew safety | 50% safety, 30% illumination, 20% proximity |
| `robotic` | Robotic lander - balances safety and power | 40% safety, 40% illumination, 20% proximity |
| `rover` | Rover traverse - prioritizes accessibility | 30% safety, 20% illumination, 50% accessibility |
| `custom` | Balanced multi-criteria profile | 40% safety, 30% illumination, 30% proximity |

**Example Request:**

```bash
curl -H "X-API-Key: ldp_live_YOUR_KEY" \
  "https://lunarlandingsiteapi.up.railway.app/api/v1/recommendations?lat=-89.5&lon=45.0&mission_type=artemis&top_n=5"
```

**Python Example:**
```python
import requests

API_KEY = "ldp_live_YOUR_KEY_HERE"
headers = {"X-API-Key": API_KEY}

response = requests.get(
    "https://lunarlandingsiteapi.up.railway.app/api/v1/recommendations",
    headers=headers,
    params={
        "lat": -89.5,
        "lon": 45.0,
        "mission_type": "artemis",
        "top_n": 5
    }
)

data = response.json()
print(f"Mission: {data['mission_profile']['description']}")
print(f"\nTop {len(data['recommendations'])} Recommendations:")

for rec in data['recommendations']:
    print(f"\n{rec['rank']}. Site {rec['site_id']} (Score: {rec['overall_score']:.1f}/10)")
    print(f"   {rec['reasoning']}")
    print(f"   Strengths: {', '.join(rec['strengths'])}")
    if rec['warnings']:
        print(f"   Warnings: {', '.join(rec['warnings'])}")
```

**Response:**
```json
{
  "mission_profile": {
    "type": "artemis",
    "description": "Artemis human landing mission - prioritizes crew safety",
    "priorities": {
      "safety": 0.5,
      "illumination": 0.3,
      "proximity": 0.2
    }
  },
  "recommendations": [
    {
      "rank": 1,
      "site_id": 928913,
      "location": {"lat": -89.947, "lon": 51.466},
      "overall_score": 4.646,
      "scores": {
        "safety_score": 2.78,
        "illumination_score": 7.52,
        "accessibility_score": 5.0,
        "overall_score": 4.646
      },
      "reasoning": "Moderate safety concerns (hazard 3.00) with good visibility (75.2%), reasonable distance (50.0 km). Prioritizes crew safety for human landing.",
      "warnings": [
        "Steep slopes present (mean 16.5°)",
        "Rough terrain (roughness 9.73m)",
        "Elevated hazard index (3.00/3)"
      ],
      "strengths": [
        "Meets baseline mission requirements"
      ],
      "terrain": {
        "slope_mean_deg": 16.5,
        "slope_max_deg": 32.6,
        "slope_std_deg": 5.5,
        "hazard_index": 3.0,
        "roughness_rms_m": 9.73,
        "relief_m": 46.58,
        "elevation_mean_m": 1242.1
      },
      "illumination": {
        "visibility_pct": 75.2,
        "visibility_min_pct": 61.5,
        "visibility_std_pct": 6.7
      }
    }
  ],
  "search_stats": {
    "candidates_analyzed": 64,
    "search_radius_km": 50.0,
    "target_location": {"lat": -89.5, "lon": 45.0}
  },
  "user": {
    "email": "you@example.com",
    "name": "Your Name",
    "tier": "beta",
    "requests_today": 48,
    "requests_remaining": 952,
    "rate_limit": 1000
  }
}
```

**Key Features:**
- Analyzes 50-100 candidate sites before ranking
- Mission-specific weighted scoring
- Plain English reasoning for each recommendation
- Automatic warning detection (distance, hazards, terrain issues)
- Strength identification (top performers in each category)

---

### POST `/api/v1/compare`

**Description:** Compare multiple landing sites side-by-side with trade-off analysis  
**Authentication:** Required  
**Limits:** Minimum 2 sites, maximum 10 sites

**Request Body:**
```json
{
  "site_ids": [928913, 928914, 929072]
}
```

**Example Request:**

```bash
curl -X POST https://lunarlandingsiteapi.up.railway.app/api/v1/compare \
  -H "X-API-Key: ldp_live_YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"site_ids": [928913, 928914, 929072]}'
```

**Python Example:**
```python
import requests

API_KEY = "ldp_live_YOUR_KEY_HERE"
headers = {"X-API-Key": API_KEY}

response = requests.post(
    "https://lunarlandingsiteapi.up.railway.app/api/v1/compare",
    headers=headers,
    json={"site_ids": [928913, 928914, 929072]}
)

data = response.json()
print(f"Overall Winner: Site {data['winner_by_category']['overall']}")
print(f"Safest: Site {data['winner_by_category']['safety']}")
print(f"Best Illumination: Site {data['winner_by_category']['illumination']}")

print(f"\nRecommendation: {data['recommendation']['reasoning']}")

for site in data['sites']:
    print(f"\nSite {site['site_id']} (Score: {site['scores']['overall_score']:.1f}/10):")
    print(f"  Best for: {site['best_for']}")
    print(f"  Pros: {', '.join(site['pros'])}")
    print(f"  Cons: {', '.join(site['cons'])}")
```

**Response:**
```json
{
  "winner_by_category": {
    "safety": 928913,
    "illumination": 928913,
    "overall": 928913
  },
  "sites": [
    {
      "site_id": 928913,
      "location": {"lat": -89.947, "lon": 51.466},
      "scores": {
        "safety_score": 2.78,
        "illumination_score": 7.52,
        "accessibility_score": 5.0,
        "overall_score": 4.646
      },
      "terrain": {...},
      "illumination": {...},
      "pros": [
        "Meets baseline requirements"
      ],
      "cons": [
        "Steep slopes present (mean 16.5°)",
        "Rough terrain (roughness 9.73m)"
      ],
      "best_for": "Secondary target or contingency site"
    }
  ],
  "recommendation": {
    "top_choice": 928913,
    "reasoning": "Site 928913 offers the best overall balance with safety score 2.8/10 and illumination score 7.5/10",
    "alternatives": "Consider site 928914 for maximum safety or site 929072 for optimal power generation"
  },
  "user": {
    "email": "you@example.com",
    "name": "Your Name",
    "tier": "beta",
    "requests_today": 49,
    "requests_remaining": 951,
    "rate_limit": 1000
  }
}
```

**Use Cases:**
- Compare 3-5 finalist sites after initial screening
- Understand trade-offs between safety, illumination, and accessibility
- Get clear recommendation with reasoning
- See category winners (best safety, best illumination, etc.)

---

## Response Schemas

### Location Object
```json
{
  "lat": -89.947,
  "lon": 51.466
}
```

### Terrain Metrics Object
```json
{
  "slope_mean_deg": 16.5,
  "slope_max_deg": 32.6,
  "slope_std_deg": 5.5,
  "hazard_index": 3.0,
  "roughness_rms_m": 9.73,
  "relief_m": 46.58,
  "elevation_mean_m": 1242.1
}
```

**Field Descriptions:**
- `slope_mean_deg`: Average slope within 100m radius
- `slope_max_deg`: Maximum slope encountered
- `slope_std_deg`: Standard deviation of slope (terrain variability)
- `hazard_index`: Composite safety metric (0-3, lower is safer)
- `roughness_rms_m`: RMS roughness (terrain texture)
- `relief_m`: Elevation difference (max - min elevation)
- `elevation_mean_m`: Average elevation above lunar datum

### Illumination Metrics Object
```json
{
  "visibility_pct": 75.2,
  "visibility_min_pct": 61.5,
  "visibility_std_pct": 6.7
}
```

**Field Descriptions:**
- `visibility_pct`: Average solar visibility percentage over lunar year
- `visibility_min_pct`: Minimum visibility during worst period
- `visibility_std_pct`: Standard deviation of visibility (consistency measure)

### Data Quality Object
```json
{
  "terrain_coverage_pct": 100.0,
  "illumination_source_res_m": 60
}
```

**Field Descriptions:**
- `terrain_coverage_pct`: Percentage of analysis area with valid terrain data
- `illumination_source_res_m`: Resolution of source illumination data in meters

---

## 🎯 Best Practices

### 1. Search Strategy Workflow

```
Step 1: Start Broad
├─ Large radius (100-200km)
├─ Relaxed filters
└─ Goal: Overview of available sites

Step 2: Refine
├─ Decrease radius (50km)
├─ Tighten filters (max_hazard, min_visibility)
└─ Goal: Focus on most promising areas

Step 3: Get Recommendations
├─ Use /recommendations endpoint
├─ Specify mission_type
└─ Goal: Mission-specific intelligent ranking

Step 4: Compare Finalists
├─ Use /compare on top 3-5 candidates
└─ Goal: Understand trade-offs

Step 5: Verify
├─ Get full details with /batch
└─ Goal: Final validation
```

### 2. Filter Guidelines

**Conservative (High-stakes crewed missions):**
```python
params = {
    "max_hazard": 1.5,
    "min_visibility": 70.0,
    "max_slope": 10.0
}
# Use case: Artemis landing sites
```

**Moderate (Standard robotic missions):**
```python
params = {
    "max_hazard": 2.0,
    "min_visibility": 50.0,
    "max_slope": 15.0
}
# Use case: Commercial landers, science missions
```

**Exploratory (Scouting/contingency sites):**
```python
params = {
    "max_hazard": 2.5,
    "min_visibility": 30.0,
    "max_slope": 20.0
}
# Use case: Rover traverses, backup sites
```

### 3. Caching Strategy

```python
import json
from datetime import datetime, timedelta

class APICache:
    def __init__(self, cache_duration_hours=24):
        self.cache = {}
        self.cache_duration = timedelta(hours=cache_duration_hours)
    
    def get(self, key):
        if key in self.cache:
            data, timestamp = self.cache[key]
            if datetime.now() - timestamp < self.cache_duration:
                return data
        return None
    
    def set(self, key, data):
        self.cache[key] = (data, datetime.now())

# Usage
cache = APICache(cache_duration_hours=24)

def get_recommendations_cached(lat, lon, mission_type):
    cache_key = f"{lat},{lon},{mission_type}"
    
    # Check cache first
    cached_data = cache.get(cache_key)
    if cached_data:
        print("Using cached data")
        return cached_data
    
    # Make API request
    response = requests.get(
        "https://lunarlandingsiteapi.up.railway.app/api/v1/recommendations",
        headers={"X-API-Key": API_KEY},
        params={"lat": lat, "lon": lon, "mission_type": mission_type}
    )
    data = response.json()
    
    # Cache the result
    cache.set(cache_key, data)
    return data
```

### 4. Performance Optimization

**For Fast Queries (<50ms):**
- Use smaller search radii (10-50km)
- Apply stricter filters to reduce result processing
- Use batch endpoint for multiple site lookups
- Cache results when querying repeatedly
- Limit results to what you actually need

**For Comprehensive Results:**
- Use larger radii (100km+) for regional surveys
- Relax filters for exploratory analysis
- Use recommendations endpoint for intelligent filtering

**Performance Benchmarks:**

| Operation | Typical Latency | Notes |
|-----------|----------------|-------|
| `/search` (10 results) | 40-60ms | Most common query |
| `/batch` (10 sites) | 15-25ms | Optimized bulk retrieval |
| `/recommendations` | 80-120ms | Complex multi-site scoring |
| `/compare` | 30-50ms | Side-by-side analysis |

---

## 💻 Code Examples

### Complete Python Example: Mission Planning Workflow

```python
import requests
import json

API_KEY = "ldp_live_YOUR_KEY_HERE"
BASE_URL = "https://lunarlandingsiteapi.up.railway.app"
headers = {"X-API-Key": API_KEY}

def complete_mission_planning_workflow():
    """Complete workflow: Search → Recommend → Compare → Select"""
    
    target_lat, target_lon = -89.5, 45.0
    
    # Step 1: Get initial recommendations
    print("Step 1: Getting recommendations near target...")
    recs_response = requests.get(
        f"{BASE_URL}/api/v1/recommendations",
        headers=headers,
        params={
            "lat": target_lat,
            "lon": target_lon,
            "mission_type": "artemis",
            "top_n": 5
        }
    )
    recs = recs_response.json()
    
    print(f"Found {len(recs['recommendations'])} recommendations")
    print(f"Analyzed {recs['search_stats']['candidates_analyzed']} candidates")
    print(f"Requests remaining: {recs['user']['requests_remaining']}\n")
    
    # Step 2: Print top recommendations
    print("Step 2: Top 5 Sites:")
    for rec in recs['recommendations']:
        print(f"\n{rec['rank']}. Site {rec['site_id']} - Score: {rec['overall_score']:.1f}/10")
        print(f"   {rec['reasoning']}")
        print(f"   Strengths: {', '.join(rec['strengths'][:2])}")
    
    # Step 3: Compare top 3 candidates
    print("\n\nStep 3: Comparing top 3 finalists...")
    top_3_ids = [rec['site_id'] for rec in recs['recommendations'][:3]]
    
    compare_response = requests.post(
        f"{BASE_URL}/api/v1/compare",
        headers=headers,
        json={"site_ids": top_3_ids}
    )
    comparison = compare_response.json()
    
    # Step 4: Show comparison results
    print(f"\nWinner by Category:")
    print(f"  Overall: Site {comparison['winner_by_category']['overall']}")
    print(f"  Safety: Site {comparison['winner_by_category']['safety']}")
    print(f"  Illumination: Site {comparison['winner_by_category']['illumination']}")
    
    print(f"\nFinal Recommendation:")
    print(f"  {comparison['recommendation']['reasoning']}")
    print(f"  {comparison['recommendation']['alternatives']}")
    
    # Step 5: Get full details of winner
    winner_id = comparison['winner_by_category']['overall']
    print(f"\n\nStep 4: Getting detailed info for winner (Site {winner_id})...")
    
    batch_response = requests.post(
        f"{BASE_URL}/api/v1/sites/batch",
        headers=headers,
        json={"site_ids": [winner_id]}
    )
    winner_details = batch_response.json()['sites'][0]
    
    # Save results
    results = {
        "target": {"lat": target_lat, "lon": target_lon},
        "recommendations": recs['recommendations'],
        "comparison": comparison,
        "winner": winner_details,
        "usage": recs['user']
    }
    
    with open('mission_planning_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✅ Complete! Results saved to mission_planning_results.json")
    print(f"Requests used: {recs['user']['requests_today']}")
    print(f"Requests remaining today: {recs['user']['requests_remaining']}")

if __name__ == "__main__":
    complete_mission_planning_workflow()
```

### Complete JavaScript Example: React Site Search Component

```javascript
import React, { useState } from 'react';

const API_KEY = "ldp_live_YOUR_KEY_HERE";
const BASE_URL = "https://lunarlandingsiteapi.up.railway.app";

function LunarSiteExplorer() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usage, setUsage] = useState(null);

  const searchSites = async (lat, lon, missionType = 'artemis') => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        lat,
        lon,
        mission_type: missionType,
        top_n: 5
      });
      
      const response = await fetch(
        `${BASE_URL}/api/v1/recommendations?${params}`,
        { headers: { 'X-API-Key': API_KEY } }
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      setSites(data.recommendations);
      setUsage(data.user);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lunar-explorer">
      <h2>Lunar Landing Site Explorer</h2>
      
      <button onClick={() => searchSites(-89.5, 0, 'artemis')}>
        Search Near South Pole (Artemis)
      </button>
      
      {loading && <p>Searching...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      
      {usage && (
        <div className="usage-info">
          <p>Requests today: {usage.requests_today} / {usage.rate_limit}</p>
          <p>Remaining: {usage.requests_remaining}</p>
        </div>
      )}
      
      <div className="results">
        {sites.map(site => (
          <div key={site.site_id} className="site-card">
            <h3>Rank {site.rank}: Site {site.site_id}</h3>
            <p><strong>Score:</strong> {site.overall_score.toFixed(1)}/10</p>
            <p><strong>Location:</strong> {site.location.lat.toFixed(3)}°, {site.location.lon.toFixed(3)}°</p>
            <p><strong>Reasoning:</strong> {site.reasoning}</p>
            <div>
              <strong>Strengths:</strong>
              <ul>
                {site.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            {site.warnings.length > 0 && (
              <div>
                <strong>Warnings:</strong>
                <ul>
                  {site.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default LunarSiteExplorer;
```

---

## Data Sources & Methodology

### Terrain Data
- **Source:** NASA LOLA (Lunar Orbiter Laser Altimeter)
- **Resolution:** 5 meters per pixel
- **Coverage:** -90° to -83.5° latitude (lunar south pole)
- **Original CRS:** Polar Stereographic (source rasters)
- **Derived Metrics:** Slope, roughness, relief, hazard index

### Illumination Data
- **Source:** NASA LROC (Lunar Reconnaissance Orbiter Camera)
- **Resolution:** 60-240m (latitude-dependent)
- **Coverage:** Full lunar south pole
- **Metrics:** Visibility percentage over lunar year, solar period

### Processing Pipeline
1. Download NASA PDS data archives (polar projection)
2. Generate 1.18M candidate landing sites from source rasters
3. Extract terrain and illumination metrics at each site
4. Store in PostGIS database as WGS84 coordinates (EPSG:4326)
5. Use PostGIS Geography type for accurate distance calculations at poles
6. Calculate composite hazard index
7. Create spatial indexes (GiST) for fast queries

### Feature Analysis Scales
All terrain and illumination features are computed at three analysis radii:
- **25m radius:** Fine-scale local terrain (immediate landing zone)
- **50m radius:** Medium-scale neighborhood (landing approach area)  
- **100m radius:** Coarse-scale regional context (area operations)

The API returns 100m radius data by default as it provides the most reliable and comprehensive metrics.

### Database Implementation
- **Coordinate System:** WGS84 (EPSG:4326) for broad compatibility
- **Distance Calculations:** PostGIS Geography type (spherical math)
- **Spatial Indexing:** GiST indexes for fast spatial queries
- **Accuracy:** Geography type ensures accurate meter-based distances despite high latitude

### Hazard Index Scale

The hazard index is a composite metric (0-3) combining slope, roughness, and relief:

- **0.0-1.0:** Excellent - Safe for all mission types
- **1.0-2.0:** Good - Acceptable for most missions
- **2.0-2.5:** Moderate - Requires careful evaluation
- **2.5-3.0:** High - Challenging terrain, not recommended

### Coordinate System Technical Notes

**Why WGS84 at the South Pole?**

While WGS84 (EPSG:4326) is a geographic coordinate system that can be problematic at the poles when using simple degree-based calculations, this API uses PostGIS Geography type for all distance computations. This approach:

- **Stores coordinates as lat/lon** (universal compatibility with GIS tools)
- **Calculates distances spherically** (accurate meter-based results)
- **Handles polar convergence** (automatic compensation for longitude convergence)

**Example:** A query for sites within 50km radius uses spherical earth calculations, not simple degree-based distance, ensuring accuracy even at -89.5° latitude.

**For Advanced Users:**
If you need to work with the data in polar projection for your own analysis:
- Source data was originally in Polar Stereographic
- Convert WGS84 coordinates to EPSG:3031 (Antarctic Polar Stereographic) for planar calculations
- Most GIS tools (QGIS, ArcGIS) can reproject on import

### Data Quality
- **Total Sites:** 1,180,127
- **Complete Data:** 99.98% (1,179,905 sites)
- **Coordinate System:** WGS84 lat/lon (EPSG:4326)
- **Distance Method:** Spherical calculations via PostGIS Geography
- **Spatial Accuracy:** Meter-based distances accurate at high latitudes
- **Analysis Radius:** 100m (provides most reliable metrics)

---

## 💬 Support

### Documentation & Resources
- **Interactive API Docs:** [Swagger UI](https://lunarlandingsiteapi.up.railway.app/docs)
- **API Status:** [Health Check](https://lunarlandingsiteapi.up.railway.app/health)
- **Beta Signup:** [lunarlanding.space](https://ldp-api-beta.vercel.app)

### Contact & Help
- **Email:** info@irisdatalabs.com
- **Bug Reports:** Email with subject "API Bug Report"
- **Feature Requests:** We'd love to hear your ideas!

### Beta Program
- ✅ Free access during beta (1,000 requests/day)
- ✅ Your feedback helps shape the product
- ✅ Direct influence on future features
- ⚠️ Breaking changes possible (with email notification)

### Citation
If you use this API in research, please cite:
```
Iris Data Labs (2025). Lunar Landing Site API: Intelligent site selection 
powered by NASA terrain and illumination data. 
https://lunarlandingsiteapi.up.railway.app
```

---

## Changelog

### v1.0.0 (October 30, 2025) - Current

**🚀 Initial Public Beta Release**

**Authentication:**
- API key authentication via `X-API-Key` header
- Beta tier: 1,000 requests/day
- Usage tracking in all authenticated responses

**Data:**
- 1,180,127 analyzed landing sites
- 60+ features per site
- 99.98% data completeness

**Endpoints:**
- 6 total endpoints (2 status + 2 data + 2 decision support)
- Mission-specific intelligent recommendations
- Side-by-side site comparison
- Bulk site retrieval

**Features:**
- Sub-100ms query performance
- Plain English reasoning
- Mission-specific scoring (Artemis, robotic, rover, custom)
- Automatic warning and strength detection

**Known Limitations:**
- Coverage limited to lunar south pole (-90° to -83.5° lat)
- No export formats (GeoJSON/KML/CSV) in current version
- Maximum 100 sites per search query

**Coming Soon:**
- Premium tier (10,000 requests/day)
- Additional export formats
- Expanded coverage areas

---

**Made with 🌙 for the lunar exploration community**

*Last Updated: October 30, 2025*  
*API Version: 1.0.0*  
*Status: Public Beta*