using System;
using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class LevelPreview : MonoBehaviour
{
    [Serializable]
    public struct LevelPreviewData
    {
         public string id;
         public string authorName;
         public string levelName;
         public int likes;
    }
    
    public LevelPreviewData levelData;

    private TextMeshProUGUI levelName;
    private TextMeshProUGUI authorName; 
    private TextMeshProUGUI likes;

    
    private void OnValidate()
    {
        if (authorName == null || levelName == null || likes == null)
        {
            levelName = transform.Find("LevelName").GetComponent<TextMeshProUGUI>();
            authorName = transform.Find("AuthorName").GetComponent<TextMeshProUGUI>();
            likes = transform.Find("Likes").GetComponentInChildren<TextMeshProUGUI>(); 
        }
      
        
        SetPreview(levelData); 
    }

    // Start is called before the first frame update
    void Awake()
    {
        levelName = transform.Find("LevelName").GetComponent<TextMeshProUGUI>();
        authorName = transform.Find("AuthorName").GetComponent<TextMeshProUGUI>();
        likes = transform.Find("Likes").GetComponentInChildren<TextMeshProUGUI>();

    }
    

    public void Load()
    {
        LevelLoader.Instance.LoadLevel(levelData.id);
    }

    public void SetPreview(LevelPreviewData data)
    {
        levelData = data;
        levelName.text = levelData.levelName;
        authorName.text = levelData.authorName; 
        likes.text = levelData.likes.ToString();
    }
}
