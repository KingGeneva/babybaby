# Guide d'Intégration - Script Python → Lovable Cloud

## 📋 Vue d'ensemble

Votre pipeline d'automatisation peut publier directement dans Lovable Cloud via l'API REST. Voici comment adapter votre script `publish_cms.py`.

## 🔑 Configuration requise

### 1. Credentials Lovable Cloud

Ajoutez ces variables dans votre fichier `.env` du script Python :

```bash
# Lovable Cloud Database API
LOVABLE_CLOUD_URL="https://oqpvxoqhnrdfslxvbqde.supabase.co"
LOVABLE_CLOUD_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcHZ4b3FobnJkZnNseHZicWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NTE3NzcsImV4cCI6MjA3NzUyNzc3N30.pgGGeGxH-obz7B9WAKQ2EIIKdHz09IRmzMlrCPqw9MI"

# Votre clé OpenAI
OPENAI_API_KEY="votre_cle_openai"
LLM_MODEL="gpt-4o-mini"
```

## 📊 Structure de la table `cms_articles`

Votre script doit envoyer des articles avec cette structure JSON :

```json
{
  "title": "Titre de l'article",
  "slug": "titre-de-l-article",
  "excerpt": "Résumé court (200 caractères max)",
  "content": "Contenu complet en Markdown",
  "image": "https://url-de-l-image.jpg",
  "category": "nutrition",
  "tags": ["alimentation", "bébé", "santé"],
  "author": "BabyBaby AI",
  "reading_time": 5,
  "published": true,
  "featured": false
}
```

### Catégories disponibles
- `preparation` - Préparation à l'arrivée de bébé
- `nutrition` - Alimentation et nutrition infantile
- `sommeil` - Sommeil de bébé
- `developpement` - Développement de l'enfant
- `croissance` - Croissance et étapes importantes
- `amenagement` - Aménagement de l'espace

## 🐍 Script Python adapté

Voici comment adapter votre `publish_cms.py` :

### Installation des dépendances

```bash
pip install requests python-slugify
```

### Code du publisher

```python
import os
import requests
from slugify import slugify
from datetime import datetime

class LovableCloudPublisher:
    """Publie les articles dans Lovable Cloud via l'API REST"""
    
    def __init__(self):
        self.base_url = os.getenv("LOVABLE_CLOUD_URL")
        self.api_key = os.getenv("LOVABLE_CLOUD_ANON_KEY")
        self.headers = {
            "apikey": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
    
    def create_article(self, article_data):
        """
        Crée un nouvel article dans Lovable Cloud
        
        Args:
            article_data (dict): Données de l'article avec les champs requis
            
        Returns:
            dict: Réponse de l'API avec l'article créé
        """
        # Générer le slug automatiquement
        if "slug" not in article_data:
            article_data["slug"] = slugify(article_data["title"])
        
        # Endpoint de l'API
        url = f"{self.base_url}/rest/v1/cms_articles"
        
        try:
            response = requests.post(
                url,
                json=article_data,
                headers=self.headers
            )
            response.raise_for_status()
            
            print(f"✅ Article publié: {article_data['title']}")
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            print(f"❌ Erreur HTTP: {e}")
            print(f"Response: {e.response.text}")
            raise
        except Exception as e:
            print(f"❌ Erreur: {e}")
            raise
    
    def update_article(self, article_id, article_data):
        """Met à jour un article existant"""
        url = f"{self.base_url}/rest/v1/cms_articles?id=eq.{article_id}"
        
        try:
            response = requests.patch(
                url,
                json=article_data,
                headers=self.headers
            )
            response.raise_for_status()
            
            print(f"✅ Article mis à jour: {article_id}")
            return response.json()
            
        except Exception as e:
            print(f"❌ Erreur lors de la mise à jour: {e}")
            raise
    
    def check_article_exists(self, slug):
        """Vérifie si un article existe déjà"""
        url = f"{self.base_url}/rest/v1/cms_articles?slug=eq.{slug}&select=id"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            return data[0]["id"] if data else None
            
        except Exception as e:
            print(f"❌ Erreur lors de la vérification: {e}")
            return None


# Exemple d'utilisation
def publish_article_to_lovable(processed_article):
    """
    Prend un article traité par votre pipeline et le publie
    
    Args:
        processed_article: Article sortant de votre scorer avec score > seuil
    """
    publisher = LovableCloudPublisher()
    
    # Mapper votre structure d'article vers celle de Lovable Cloud
    article_data = {
        "title": processed_article["title"],
        "slug": slugify(processed_article["title"]),
        "excerpt": processed_article.get("summary", "")[:200],  # Max 200 caractères
        "content": processed_article["content_processed"],  # Markdown
        "image": processed_article.get("image_url", "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4"),
        "category": map_category(processed_article["topic"]),  # Fonction à adapter
        "tags": processed_article.get("tags", []),
        "author": "BabyBaby AI",
        "reading_time": estimate_reading_time(processed_article["content_processed"]),
        "published": True,
        "featured": processed_article.get("score", 0) >= 8.0  # Articles > 8/10 en featured
    }
    
    # Vérifier si l'article existe déjà
    slug = article_data["slug"]
    existing_id = publisher.check_article_exists(slug)
    
    if existing_id:
        print(f"⚠️  Article existant, mise à jour: {slug}")
        return publisher.update_article(existing_id, article_data)
    else:
        return publisher.create_article(article_data)


def map_category(topic):
    """Mappe vos topics vers les catégories Lovable Cloud"""
    category_mapping = {
        "alimentation": "nutrition",
        "nutrition": "nutrition",
        "sommeil": "sommeil",
        "developpement": "developpement",
        "croissance": "croissance",
        "preparation": "preparation",
        "amenagement": "amenagement",
    }
    return category_mapping.get(topic.lower(), "developpement")


def estimate_reading_time(content):
    """Estime le temps de lecture (250 mots/minute)"""
    word_count = len(content.split())
    minutes = max(1, round(word_count / 250))
    return minutes


# Dans votre worker principal
if __name__ == "__main__":
    # Exemple d'article traité par votre pipeline
    example_article = {
        "title": "Les bienfaits de l'allaitement maternel",
        "content_processed": "# Les bienfaits de l'allaitement...",
        "summary": "L'allaitement maternel présente de nombreux avantages...",
        "topic": "nutrition",
        "tags": ["allaitement", "nutrition", "santé"],
        "score": 8.5,
        "image_url": "https://example.com/image.jpg"
    }
    
    result = publish_article_to_lovable(example_article)
    print(f"Publié: {result}")
```

## 🔄 Intégration dans votre pipeline

Modifiez votre `services/publisher/publish_cms.py` pour utiliser cette nouvelle classe :

```python
# Dans votre boucle de publication
from lovable_publisher import LovableCloudPublisher, publish_article_to_lovable

publisher = LovableCloudPublisher()

while True:
    # Récupérer les articles scorés > seuil depuis Redis/Postgres
    articles_to_publish = get_high_score_articles()
    
    for article in articles_to_publish:
        try:
            result = publish_article_to_lovable(article)
            mark_as_published(article["id"])
            
        except Exception as e:
            print(f"Erreur publication: {e}")
            continue
    
    time.sleep(60)  # Attendre 1 minute avant la prochaine vague
```

## 🎯 Points importants

1. **ANON KEY vs SERVICE ROLE KEY**
   - Utilisez la `LOVABLE_CLOUD_ANON_KEY` fournie ci-dessus
   - Elle permet d'insérer des articles (RLS configuré pour les admins)
   - Pour un accès illimité, demandez la clé SERVICE_ROLE (non recommandé en production)

2. **Rate Limiting**
   - Lovable Cloud a des limites de requêtes
   - Ajoutez un délai entre les publications (ex: `time.sleep(1)`)

3. **Validation des données**
   - Le slug doit être unique
   - L'excerpt doit faire max 200 caractères
   - La catégorie doit exister dans la liste

4. **Gestion des images**
   - Utilisez des URLs absolues pour les images
   - Vous pouvez uploader dans Lovable Cloud Storage si besoin

## 📝 Exemple de run_all.sh adapté

```bash
#!/usr/bin/env bash

# Charger les variables d'environnement
source .env

# Vérifier que les credentials Lovable Cloud sont présents
if [ -z "$LOVABLE_CLOUD_URL" ]; then
    echo "❌ LOVABLE_CLOUD_URL manquant dans .env"
    exit 1
fi

# Lancer l'ingestion RSS
(cd services/ingestion && watch -n 300 python fetch_rss.py) &

# Lancer le processeur avec OpenAI
(cd services/processor && python worker.py) &

# Lancer le scorer
(cd services/scorer && python scoring.py) &

# Lancer le publisher vers Lovable Cloud
(cd services/publisher && python publish_cms.py) &

echo "✅ Tous les workers sont lancés"
echo "📊 Les articles seront publiés sur Lovable Cloud"
echo "🔗 Base URL: $LOVABLE_CLOUD_URL"

wait
```

## ✅ Checklist avant de lancer

- [ ] Variables d'environnement configurées (`.env`)
- [ ] Dépendances Python installées (`requests`, `python-slugify`)
- [ ] Script `publish_cms.py` adapté avec la classe `LovableCloudPublisher`
- [ ] Mapping des catégories correct
- [ ] Test manuel avec un article avant de lancer en production

## 🐛 Debugging

Si vous avez des erreurs :

```python
# Activer le mode debug
import logging
logging.basicConfig(level=logging.DEBUG)

# Tester la connexion
publisher = LovableCloudPublisher()
test_article = {
    "title": "Test Article",
    "slug": "test-article",
    "excerpt": "Test",
    "content": "Test content",
    "image": "https://via.placeholder.com/800x600",
    "category": "nutrition",
    "tags": ["test"],
    "author": "BabyBaby AI",
    "reading_time": 1,
    "published": False
}

result = publisher.create_article(test_article)
print(result)
```

## 📞 Support

Si vous rencontrez des problèmes spécifiques, partagez :
- Le message d'erreur complet
- La structure JSON que vous essayez d'envoyer
- Les logs de votre script
