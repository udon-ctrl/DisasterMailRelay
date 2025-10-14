package com.example.disasterrelay

import com.google.gson.Gson
import java.util.*

data class ProtocolData(
    val message_id: String = UUID.randomUUID().toString(),
    val recipient_hash: String,
    val encrypted_payload_b64: String,
    val ttl_seconds: Int = 300,
    val created_at: Long = System.currentTimeMillis()
)

object Protocol {
    fun toJson(data: ProtocolData): String = Gson().toJson(data)
    fun fromJson(json: String): ProtocolData = Gson().fromJson(json, ProtocolData::class.java)
}
