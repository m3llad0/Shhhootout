using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelSelectManager : MonoBehaviour
{

    public GameObject levelPreview;
    public GameObject grid;
    
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
                    GameObject.Destroy(child.gameObject);
                }
                
                foreach (APIConnection.Level level in result.data)
                {
                    LevelPreview.LevelPreviewData data = new LevelPreview.LevelPreviewData();

                    GameObject levelP = Instantiate(levelPreview);
                    levelP.GetComponent<LevelPreview>().SetPreview(data);
                }

            }
        ));
    }

}
