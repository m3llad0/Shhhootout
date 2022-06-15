using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Tilemaps;

public class MapManager : MonoBehaviour
{

  public delegate void OnLoadAction();  
  public static event OnLoadAction OnLoad;

  [SerializeField] private Tilemap  _objectMap;

  public GameObject grid;

  public GameObject enemyPrefab;
  public GameObject playerPrefab;
  private void Start()
  {
    LoadMap(LevelLoader.Instance.CurrentLevel);
  }


  public void LoadMap(string id)
  {
    Debug.Log("Loading Map: " + id);
    StartCoroutine(APIConnection.GetLevel(id, result =>
    {
      if (!result.ok)
      {
        Debug.Log(result.error.message);
        SceneManager.LoadScene("LevelSelection");
        return;
      }
 
      Debug.Log(result.data.level_data);
      LevelData mapData = result.data.level_data;

   
      //grid.transform.position = mapData.room;

      foreach (var tile in mapData.objectTiles)
      {
        switch (tile.Tile?.Type)
        {
          case TileType.Tank:
          case TileType.SandBag:
          case TileType.Crate:
            _objectMap.SetTile(tile.Position, tile.Tile);
            break;
          default:
            Debug.Log("Invalid Tile");
            break; 
        }
      }
    
      foreach (var enemyPos in mapData.enemies)
      {
        var instanced = Instantiate(enemyPrefab, enemyPos, Quaternion.identity);
      }
      
      var player = Instantiate(playerPrefab, mapData.player, Quaternion.identity);
      
      grid.transform.SetPositionAndRotation(mapData.room, Quaternion.identity);
      
      OnLoad?.Invoke();    
    }));

  }

  public void ClearMap()
  {
    Tilemap[] maps = FindObjectsOfType<Tilemap>();

    foreach (var map in maps)
    {
      map.ClearAllTiles();
    }
  }
}

[Serializable]
public struct LevelData
{
  public List<Vector3> enemies;

  public Vector3 player;

  public Vector3 room;
  
  // Could expand to many rooms
  public List<SavedTile> objectTiles;


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