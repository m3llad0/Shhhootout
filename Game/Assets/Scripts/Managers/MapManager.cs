using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.Tilemaps;

public class MapManager : MonoBehaviour
{
    [SerializeField] private Tilemap _floorMap, _wallMap, _objectMap, _doorMap;

    private void Start()
    {
       LoadMap(LevelLoader.Instance.CurrentLevel); 
    }

    public void SaveMap(Action<string> callback)
    {
        LevelData level = new LevelData();
        level.wallTiles = GetTilesFromMap(_wallMap).ToList();
        level.floorTiles = GetTilesFromMap(_floorMap).ToList(); 
        level.objectTiles = GetTilesFromMap(_objectMap).ToList();

        string jsonData = JsonUtility.ToJson(level);
        callback(jsonData);

        APIConnection.CreateLevel(jsonData, result =>
        {
            if (!result.ok)
            {
                Debug.LogError(result.error.message);
                return;
            }
            
            Debug.Log("Level Created!");
            
            // could set up events to fire on level creation
        });
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
    
    public void LoadMap(string id)
    {
        Debug.Log("Loading Map: " + id);
        APIConnection.GetLevel(id, result =>
        {
            if (!result.ok)
            {
                Debug.Log(result.error.message);
                return;
            }
            
            LevelData mapData = JsonUtility.FromJson<LevelData>(result.data.jsonData); 
            
            ClearMap();

            foreach (var tile in mapData.floorTiles)
            {
                switch (tile.Tile.Type)
                {
                    case TileType.Asphalt:
                    case TileType.Dirt: 
                    case TileType.Sand:
                        _floorMap.SetTile(tile.Position, tile.Tile);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException("Invalid tile type");
                }
            }
        
            foreach (var tile in mapData.wallTiles)
            {
                switch (tile.Tile.Type)
                {
                    case TileType.Asphalt:
                        _wallMap.SetTile(tile.Position, tile.Tile);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException("Invalid tile type");
                }
            }
        
            foreach (var tile in mapData.objectTiles)
            {
                switch (tile.Tile.Type)
                {
                    case TileType.Tank:
                    case TileType.SandBag: 
                    case TileType.Crate:
                        _objectMap.SetTile(tile.Position, tile.Tile);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException("Invalid tile type");
                }
            }
            
            foreach (var tile in mapData.doorTiles)
            {
                switch (tile.Tile.Type)
                {
                    case TileType.Tank:
                    case TileType.SandBag: 
                    case TileType.Crate:
                        _doorMap.SetTile(tile.Position, tile.Tile);
                        break;
                    default:
                        throw new ArgumentOutOfRangeException("Invalid tile type");
                }
            }
        });

    }
    
    public void ClearMap()
    {
       Tilemap[] maps =  FindObjectsOfType<Tilemap>();

       foreach (var map in maps)
       {
           map.ClearAllTiles();
       }
    }
}

[Serializable]
public struct LevelData
{
    // Could expand to many rooms
    public List<SavedTile> floorTiles;
    public List<SavedTile> wallTiles;
    public List<SavedTile> objectTiles;
    public List<SavedTile> doorTiles;

}

// public struct Room
// {
//     public List<SavedTile> floorTiles;
//     public List<SavedTile> wallTiles;
//     public List<SavedTile> objectTiles;
//     public List<SavedTile> doorTiles; 
// }

[Serializable]
public struct SavedTile
{
    public Vector3Int Position;
    public LevelTile Tile;
}