package com.example.disasterrelay

import android.content.Context
import androidx.room.Room

class StorageHelper(context: Context) {
    private val db = Room.databaseBuilder(
        context,
        RelayDatabase::class.java, "relay_db"
    ).build()

    fun saveMessage(message: RelayMessage) {
        Thread { db.relayDao().insert(message) }.start()
    }

    fun getAllMessages(callback: (List<RelayMessage>) -> Unit) {
        Thread {
            val list = db.relayDao().getAll()
            callback(list)
        }.start()
    }
}
