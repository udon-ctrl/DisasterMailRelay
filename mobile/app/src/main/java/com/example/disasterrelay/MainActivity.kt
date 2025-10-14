package com.example.disasterrelay

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log

class MainActivity : AppCompatActivity() {
    private lateinit var ble: BleManager
    private lateinit var storage: StorageHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

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
    }
}
