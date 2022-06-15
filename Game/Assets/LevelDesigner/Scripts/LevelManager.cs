using System.Collections.Generic;
using System.Linq;
  using UnityEngine;
using UnityEngine.Tilemaps;
using TMPro;

public class LevelManager : MonoBehaviour
  {
    public ItemManager [] itemButton;
    public GameObject [] itemPrefabs;
    public GameObject [] itemPreview;
    public int currentButton;

    public TextMeshProUGUI levelName;
    public TextMeshProUGUI description;

    private GameObject room;

    // Instanced Fields
    private GameObject players;
    private List<GameObject> enemies = new List<GameObject>();
    
    private LevelData _data;

    public static LevelManager Instance;

    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
        }
        else
        {
            Destroy(this);
        }
    }

    void Update()
    {
        Vector2 screenPosition = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
        Vector2 worldPosition = Camera.main.ScreenToWorldPoint(screenPosition);

        if(Input.GetMouseButtonDown(0) && itemButton[currentButton].clicked)
        {
            itemButton[currentButton].clicked = false;
            var instanced = Instantiate(itemPrefabs[currentButton], new Vector3(worldPosition.x, worldPosition.y, 0), Quaternion.identity);
            
            AddData(itemPrefabs[currentButton].tag ,instanced);
            
            if(itemPrefabs[currentButton].tag != "Room")
            {
                MonoBehaviour [] scripts = itemPrefabs[currentButton].GetComponents<MonoBehaviour>();
                foreach (MonoBehaviour script in scripts)
                {
                    Debug.Log("Script disabled");
                    script.enabled = false;
                }
}

            Destroy(GameObject.FindGameObjectWithTag("ItemPreview"));
        }
    }

    public void AddData(string tag, GameObject gameObject)
    {

        switch (tag)
        {
            case "Room":
                Debug.Log("Room Added");
                room = gameObject; 
                break;
            case "Player":
                Debug.Log("Player Added");
                players = gameObject; 
                break;
            case "Enemy":
                Debug.Log("Enemy Added");
                enemies.Add(gameObject);
                break; 
            default:
                Debug.Log("Invalid tag: " + tag);
                break;
        }
        
        
    }

   public void SaveMap()
    {

      string name = levelName.text;
      string desc = description.text;

      LevelData level = new LevelData();

      Tilemap[] tilemaps = room.GetComponentsInChildren<Tilemap>();
          
      // Hardcoded for now
      if (room != null)
      {
        level.room = room.transform.position;
      }

      // todo: use better way to get object layer   
      level.objectTiles = GetTilesFromMap(tilemaps[1]).ToList();
      
      level.enemies = new List<Vector3>();
      
      foreach (GameObject enemy in enemies)
      {
          Debug.Log(enemy);
          level.enemies.Add(enemy.transform.position);
      }

      if (players != null)
      {
          level.player = players.transform.position; 
      }
  
      string jsonData = JsonUtility.ToJson(level);
      Debug.Log(jsonData);
  
      var data = new APIConnection.CreateLevelRequest()
      {
        description = desc,
        name = name,
        level_data = jsonData
      };
  
      StartCoroutine(APIConnection.CreateLevel(data, result =>
      {
        if (!result.ok)
        {
          Debug.LogError(result.error.message);
          return;
        }
  
        Debug.Log("Level Created!");
  
        // could set up events to fire on level creation
      }));
    }
  
    IEnumerable<SavedTile> GetTilesFromMap(Tilemap map)
    {
      foreach (Vector3Int position in map.cellBounds.allPositionsWithin)
      {
        if (map.HasTile(position))
        {
          LevelTile tile = map.GetTile<LevelTile>(position);
          yield return new SavedTile()
          {
            Position = position,
            Tile = tile
          };
        }
      }
  
    }
    
    
}
