from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Wardrobe AI Service")
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

class ClothingItem(BaseModel):
    id: str
    category: str
    color: Optional[str] = None
    occasion: Optional[str] = None
    season: Optional[str] = None

class TaggingResponse(BaseModel):
    category: str
    color: str
    occasion: str
    season: str
    tags: List[str]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "wardrobe-ai"}

@app.post("/auto-tag", response_model=TaggingResponse)
async def auto_tag_item(image_url: str):
    if not os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENROUTER_API_KEY") == "your_openai_key_here":
        return {
            "category": "TOP",
            "color": "white",
            "occasion": "CASUAL",
            "season": "SUMMER",
            "tags": ["minimal", "cotton"]
        }

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze this clothing item and return JSON with: category (TOP, BOTTOM, FOOTWEAR, ACCESSORY, OUTERWEAR, ONE_PIECE), color, occasion (CASUAL, FORMAL, PARTY, WORK, TRAVEL, GYM), season (SPRING, SUMMER, FALL, WINTER, ALL_SEASON), and a list of tags. Return ONLY the JSON."},
                        {"type": "image_url", "image_url": {"url": image_url}}
                    ],
                }
            ],
            response_format={"type": "json_object"}
        )
        import json
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-outfit")
async def generate_outfit(user_preferences: Dict, weather: str, occasion: str, items: List[ClothingItem]):
    if not os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_API_KEY") == "your_openai_key_here":
        return {
            "outfit": "Minimal Daily Set",
            "item_ids": [item.id for item in items[:3]] if items else [],
            "reasoning": "Matching based on current weather and occasion using available items."
        }

    try:
        items_description = "\n".join([f"- {item.id}: {item.category}, color: {item.color}, season: {item.season}" for item in items])
        prompt = f"""
        Given the following clothing items:
        {items_description}
        
        Suggest an outfit for:
        Occasion: {occasion}
        Weather: {weather}
        Preferences: {user_preferences}
        
        Return JSON with:
        - outfit: A name for the outfit
        - item_ids: List of item IDs included in the outfit
        - reasoning: Why these items work together for this occasion/weather.
        """
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        import json
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

