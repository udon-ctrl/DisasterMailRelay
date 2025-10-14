package com.example.disasterrelay

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log

class MainActivity : AppCompatActivity() {
    private lateinit var ble: BleManager
    private lateinit var storage: StorageHelper
    private val TAG = "DisasterRelay"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        Log.d(TAG, "アプリが起動しました")          // デバッグ用
        Log.i(TAG, "情報ログの例")                  // 情報
        Log.w(TAG, "警告ログの例")                  // 警告
        Log.e(TAG, "エラーログの例")                // エラー

        ble = BleManager(this)
        storage = StorageHelper(this)

        // 1. 広告開始
        val data = Protocol.toJson(
            ProtocolData(recipient_hash = "hash123", encrypted_payload_b64 = "payloadXYZ")
        )
        ble.startAdvertising(data)

        // 2. スキャン開始
        ble.startScanning { received ->
            Log.d("APP", "Received: $received")
            val message = Protocol.fromJson(received)
            storage.saveMessage(
                RelayMessage(
                    message.message_id,
                    message.recipient_hash,
                    message.encrypted_payload_b64,
                    message.created_at
                )
            )
        }
        if (checkSelfPermission(android.Manifest.permission.BLUETOOTH_CONNECT) != PackageManager.PERMISSION_GRANTED ||
            checkSelfPermission(android.Manifest.permission.BLUETOOTH_SCAN) != PackageManager.PERMISSION_GRANTED ||
            checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            requestPermissions(arrayOf(
                android.Manifest.permission.BLUETOOTH_CONNECT,
                android.Manifest.permission.BLUETOOTH_SCAN,
                android.Manifest.permission.ACCESS_FINE_LOCATION
            ), 1001)
        }
    }
}
