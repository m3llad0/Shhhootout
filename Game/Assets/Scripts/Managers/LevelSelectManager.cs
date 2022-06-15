using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelSelectManager : MonoBehaviour
{

    public GameObject levelPreview;
    public GameObject grid;

    private void Start()
    {
       LoadTrendingLevels(); 
    }

    public void LoadTrendingLevels()
    {
        StartCoroutine(APIConnection.GetTrendingLevels(result =>
            {
                if (!result.ok)
                {
                    Debug.Log(result.error.message);
                    return;
                }
                
                // Clear Children
                foreach (Transform child in grid.transform) {
                    Destroy(child.gameObject);
                }
                
                foreach (APIConnection.Level level in result.data)
                {
                    LevelPreview.LevelPreviewData data = new LevelPreview.LevelPreviewData
                    {
                        id = level.level_id,
                        authorName = level.user.username,
                        levelName = level.name
                    };

                    GameObject levelP = Instantiate(levelPreview, grid.transform);
                    levelP.GetComponent<LevelPreview>().SetPreview(data);
                }

            }
        ));
    }

    public void LoadPlayerLevels()
    {
        StartCoroutine(APIConnection.GetLevels(result =>
            {
                if (!result.ok)
                {
                    Debug.Log(result.error.message);
                    return;
                }
                
                // Clear Children
                foreach (Transform child in grid.transform) {
                    Destroy(child.gameObject);
                }
                
                foreach (APIConnection.Level level in result.data)
                {
                    LevelPreview.LevelPreviewData data = new LevelPreview.LevelPreviewData
                    {
                        id = level.level_id,
                        authorName = level.user.username,
                        levelName = level.name,
                        likes = level.like
                    };

                    GameObject levelP = Instantiate(levelPreview, grid.transform);
                    levelP.GetComponent<LevelPreview>().SetPreview(data);
                }

            }
        ));
    }

}
