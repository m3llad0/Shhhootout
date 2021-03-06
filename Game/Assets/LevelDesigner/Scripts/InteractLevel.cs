using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class InteractLevel : MonoBehaviour
{
    // Start is called before the first frame update
    public void OnLike() {
    
        var request =  new APIConnection.RateLevelRequest ();
        request.like = true;
        StartCoroutine(APIConnection.RateLevel(
             request, LevelLoader.Instance.CurrentLevel, result => { 
                 Debug.Log(result.ok);
                 Debug.Log( result.error.message);
                Debug.Log("Level Rated!!" + result.data.message);
             }
        ));
     
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
